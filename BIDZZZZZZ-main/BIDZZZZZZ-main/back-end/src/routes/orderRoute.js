import express from "express";
import { createOrder, paymentSuccess, paymentCancel, updateShipping, updateOrderStatus, payWithWallet } from "../controller/orderController.js";
import { getDeliveryData, verifyDeliveryQr } from "../controller/deliveryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/create/:auctionId", authMiddleware, createOrder);
router.post("/:id/pay", authMiddleware, payWithWallet);
router.get("/success", paymentSuccess);
router.get("/cancel", paymentCancel);

// GET /api/orders/my
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ winner: req.user._id }, { seller: req.user._id }],
    })
      .populate({ path: "auction", populate: { path: "Product", select: "name image" } })
      .populate("winner", "fullName email")
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/orders/:id/shipping
router.patch("/:id/shipping", authMiddleware, updateShipping);

// PATCH /api/orders/:id/status
router.patch("/:id/status", authMiddleware, updateOrderStatus);
router.get("/:id/delivery", authMiddleware, getDeliveryData);
router.post("/verify-delivery", authMiddleware, verifyDeliveryQr);

// GET /api/orders/:id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({ path: "auction", populate: { path: "Product", select: "name image description" } })
      .populate("winner", "fullName email")
      .populate("seller", "fullName email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const uid = req.user._id.toString();
    const winnerId = order.winner?._id?.toString() || order.winner?.toString();
    const sellerId = order.seller?._id?.toString() || order.seller?.toString();
    if (winnerId !== uid && sellerId !== uid) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
