import Order from "../models/Order.js";
import Auction from "../models/Auctions.js";
import Bid from "../models/Bid.js";
import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";
import { createAndEmitNotification } from "./notification.js";
import { maybeExpireAuction } from "./auctionController.js";
import { ensureWalletForUser } from "./walletController.js";
import QRCode from "qrcode";

// POST /api/orders/create/:auctionId
export const createOrder = async (req, res) => {
  try {
    const { auctionId } = req.params;

    let auction = await Auction.findById(auctionId).populate("Product");
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    auction = await maybeExpireAuction(auction);

    if (auction.status !== "ended") {
      return res.status(400).json({ message: "Auction is not ended yet" });
    }

    if (!auction.highestBider) {
      return res.status(400).json({ message: "No winner found for this auction" });
    }

    if (auction.highestBider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the auction winner can create an order" });
    }

    const existingOrder = await Order.findOne({ auction: auctionId });
    if (existingOrder) {
      if (existingOrder.paymentStatus === "paid") {
        return res.status(200).json({ message: "Order already paid.", orderId: existingOrder._id, alreadyPaid: true });
      }
      return res.status(200).json({ message: "Order already exists.", orderId: existingOrder._id });
    }

    const highestBid = await Bid.findOne({ auction: auctionId }).sort({ amount: -1 });
    if (!highestBid) return res.status(400).json({ message: "No bids found for this auction" });

    await ensureWalletForUser(req.user._id);

    const order = await Order.create({
      auction: auction._id,
      winner: auction.highestBider,
      seller: auction.seller,
      product: auction.Product._id,
      finalPrice: highestBid.amount,
      shippingAddress: req.body.shippingAddress || "",
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    createAndEmitNotification({
      receiver: auction.seller,
      sender: req.user._id,
      type: "new_order",
      title: "New Order",
      message: `The winner is ready to pay for "${auction.Product?.name}".`,
      relatedId: order._id,
    }).catch(() => {});

    return res.status(201).json({ message: "Order created.", orderId: order._id });
  } catch (error) {
    return res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

// POST /api/orders/:id/pay  — wallet payment
export const payWithWallet = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("auction winner seller");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const uid = req.user._id.toString();
    const winnerId = order.winner?._id?.toString() || order.winner?.toString();
    if (uid !== winnerId) return res.status(403).json({ message: "Not authorized" });

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    // Money is already in Admin Escrow from the bid lock phase.
    const adminUser = await (await import("../models/User.js")).default.findOne({ role: "admin" });
    if (!adminUser) return res.status(500).json({ message: "Admin account not found" });
    const adminWallet = await ensureWalletForUser(adminUser._id);

    if (adminWallet.escrowBalance < order.finalPrice) {
      return res.status(400).json({ message: "System error: insufficient escrow funds for this order." });
    }

    // Log the formal payment completion
    await WalletTransaction.create({
      user: req.user._id,
      type: "order_charge",
      amount: order.finalPrice,
      status: "completed",
      description: `Confirmed payment for order #${order._id}`,
      relatedOrder: order._id,
    });

    order.paymentStatus = "paid";
    order.orderStatus = "processing";
    order.paidAt = new Date();
    await order.save();

    const qrData = JSON.stringify({ orderId: order._id, token: Math.random().toString(36).substring(7) });
    order.qrCode = await QRCode.toDataURL(qrData);
    await order.save();

    createAndEmitNotification({
      receiver: order.seller._id,
      sender: req.user._id,
      type: "payment_completed",
      title: "Payment Successful",
      message: `Your payment of $${order.finalPrice} was successful. A QR code has been generated for delivery.`,
      relatedId: order._id,
    }).catch(() => {});

    createAndEmitNotification({
      sender: req.user._id,
      receiver: order.winner._id,
      type: "qr_generated",
      title: "QR Code Ready",
      message: `Payment received for your auction. A QR code has been generated for delivery confirmation.`,
      relatedId: order._id,
    }).catch(() => {});

    return res.status(200).json({ message: "Payment successful", order });
  } catch (error) {
    return res.status(500).json({ message: "Payment error", error: error.message });
  }
};

// PATCH /api/orders/:id/shipping
export const updateShipping = async (req, res) => {
  try {
    const { shippingAddress, shippingDetails } = req.body;
    if (!shippingAddress?.trim() && !shippingDetails) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.winner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.shippingAddress = shippingAddress?.trim() || `${shippingDetails?.address || ""}, ${shippingDetails?.city || ""}`;
    order.shippingDetails = shippingDetails || order.shippingDetails || {};
    await order.save();

    return res.status(200).json({ message: "Shipping address updated", order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const allowed = ["processing", "shipped", "delivered", "cancelled"];

    if (!allowed.includes(orderStatus)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(", ")}` });
    }

    const order = await Order.findById(req.params.id).populate("winner seller");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const sellerId = order.seller?._id?.toString() || order.seller?.toString();
    if (sellerId !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only the seller can update order status" });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({ message: "Cannot update status before payment is confirmed" });
    }

    order.orderStatus = orderStatus;
    if (orderStatus === "shipped") order.shippedAt = new Date();
    if (orderStatus === "delivered") {
      order.deliveredAt = new Date();
      if (!order.qrVerified) {
        const adminUser = await (await import("../models/User.js")).default.findOne({ role: "admin" });
        if (adminUser) {
          const adminWallet = await ensureWalletForUser(adminUser._id);
          if (adminWallet.escrowBalance >= order.finalPrice) {
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

            const sellerWalletId = order.seller?._id || order.seller;
            const sellerWallet = await ensureWalletForUser(sellerWalletId);
            sellerWallet.balance += order.finalPrice;
            await sellerWallet.save();
            await WalletTransaction.create({
              user: sellerWalletId,
              type: "deposit",
              amount: order.finalPrice,
              status: "completed",
              description: `Payment received for order #${order._id}`,
              relatedOrder: order._id,
            });

            // Mark the original pending holds as completed
            if (order.auction) {
              await WalletTransaction.updateMany(
                { relatedAuction: order.auction, type: { $in: ["bid_lock", "escrow_hold"] }, status: "pending" },
                { $set: { status: "completed" } }
              );
            }

            createAndEmitNotification({
              receiver: sellerWalletId,
              type: "money_released",
              title: "Payment Released",
              message: `$${order.finalPrice} has been transferred to your wallet for order #${order._id?.toString().slice(-8).toUpperCase()}.`,
              relatedId: order._id,
            }).catch(() => {});
          }
        }
        order.qrVerified = true; // Prevent double release
      }
    }
    await order.save();

    const statusMessages = {
      shipped: "Your order has been shipped! Track your delivery.",
      delivered: "Your order has been delivered. Enjoy your item!",
      cancelled: "Your order has been cancelled. Please contact support.",
    };
    if (statusMessages[orderStatus]) {
      createAndEmitNotification({
        receiver: order.winner._id,
        sender: order.seller._id,
        type: "auction_won",
        title: `Order ${orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}`,
        message: statusMessages[orderStatus],
        relatedId: order._id,
      }).catch(() => {});
    }

    return res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Legacy stubs — kept so existing routes don't break
export const paymentSuccess = async (req, res) => res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard/orders`);
export const paymentCancel  = async (req, res) => res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard/orders`);
