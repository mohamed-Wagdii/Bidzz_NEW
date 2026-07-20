import Order from "../models/Order.js";
import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";
import User from "../models/User.js";
import { ensureWalletForUser } from "./walletController.js";
import { createAndEmitNotification } from "./notification.js";
import QRCode from "qrcode";

export const getDeliveryData = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("auction winner seller product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const uid = req.user._id.toString();
    const sellerId = order.seller?._id?.toString() || order.seller?.toString();
    const winnerId = order.winner?._id?.toString() || order.winner?.toString();

    if (sellerId !== uid && winnerId !== uid && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Regenerate QR if not present
    if (!order.qrCode) {
      const qrPayload = JSON.stringify({ orderId: order._id.toString(), v: 1 });
      order.qrCode = await QRCode.toDataURL(qrPayload);
      await order.save();
    }

    res.json({ order, qrCode: order.qrCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyDeliveryQr = async (req, res) => {
  try {
    const { orderId, qrData } = req.body;
    if (!orderId || !qrData) return res.status(400).json({ message: "orderId and qrData are required" });

    const order = await Order.findById(orderId).populate("winner seller");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.qrVerified) return res.status(400).json({ message: "QR already used" });
    if (order.paymentStatus !== "paid") return res.status(400).json({ message: "Order not paid" });

    let parsed;
    try { parsed = JSON.parse(qrData); } catch { return res.status(400).json({ message: "Invalid QR data" }); }
    if (parsed.orderId !== orderId) return res.status(400).json({ message: "QR mismatch" });

    // Transfer from admin escrow to seller wallet
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) return res.status(500).json({ message: "Admin not found" });

    const adminWallet = await ensureWalletForUser(adminUser._id);
    if (adminWallet.escrowBalance < order.finalPrice) {
      return res.status(400).json({ message: "Insufficient escrow balance" });
    }

    adminWallet.escrowBalance -= order.finalPrice;
    await adminWallet.save();
    await WalletTransaction.create({
      user: adminUser._id,
      type: "escrow_release",
      amount: order.finalPrice,
      status: "completed",
      description: `Escrow released for order #${order._id}`,
      relatedOrder: order._id,
    });

    const sellerId = order.seller?._id || order.seller;
    const sellerWallet = await ensureWalletForUser(sellerId);
    sellerWallet.balance += order.finalPrice;
    await sellerWallet.save();
    await WalletTransaction.create({
      user: sellerId,
      type: "escrow_release",
      amount: order.finalPrice,
      status: "completed",
      description: `Payment received for order #${order._id}`,
      relatedOrder: order._id,
    });

    order.orderStatus = "delivered";
    order.deliveredAt = new Date();
    order.qrVerified = true;
    await order.save();

    const winnerId = order.winner?._id || order.winner;

    // Notify seller
    createAndEmitNotification({
      receiver: sellerId,
      type: "money_released",
      title: "Payment Released",
      message: `$${order.finalPrice} has been transferred to your wallet for order #${order._id?.toString().slice(-8).toUpperCase()}.`,
      relatedId: order._id,
    }).catch(() => {});

    // Notify buyer
    createAndEmitNotification({
      receiver: winnerId,
      type: "qr_verified",
      title: "Delivery Confirmed",
      message: `Your delivery has been confirmed. Order #${order._id?.toString().slice(-8).toUpperCase()} is complete.`,
      relatedId: order._id,
    }).catch(() => {});

    res.json({ message: "Delivery verified and payment released", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
