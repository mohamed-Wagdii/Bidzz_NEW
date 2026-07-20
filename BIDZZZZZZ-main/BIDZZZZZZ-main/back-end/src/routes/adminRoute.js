import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Auction from "../models/Auctions.js";
import Order from "../models/Order.js";
import Bid from "../models/Bid.js";

const router = express.Router();

// ── Admin guard ───────────────────────────────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ message: "Admin access required." });
  next();
};

router.use(authMiddleware, adminOnly);

// ── Users ─────────────────────────────────────────────────────────────────────
router.get("/users", async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email:    { $regex: search, $options: "i" } },
    ];
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -passwordResetToken -passwordResetExpires")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    const { role, lockUntil } = req.body;
    const update = {};
    if (role !== undefined) {
      const allowedRoles = ["buyer", "seller", "admin"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: `role must be one of: ${allowedRoles.join(", ")}` });
      }
      update.role = role;
    }
    if (lockUntil !== undefined) update.lockUntil = lockUntil;
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true })
      .select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ message: "Cannot delete your own account." });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Auctions ──────────────────────────────────────────────────────────────────
router.get("/auctions", async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const [auctions, total] = await Promise.all([
      Auction.find(filter)
        .populate("Product", "name image price")
        .populate("seller", "fullName email")
        .populate("highestBider", "fullName")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Auction.countDocuments(filter),
    ]);
    // attach bid counts
    const result = await Promise.all(auctions.map(async a => {
      const bidCount = await Bid.countDocuments({ auction: a._id });
      return { ...a.toObject(), bidCount };
    }));
    res.json({ auctions: result, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/auctions/:id/end", async (req, res) => {
  try {
    const auction = await Auction.findByIdAndUpdate(
      req.params.id, { status: "ended" }, { new: true }
    );
    if (!auction) return res.status(404).json({ message: "Auction not found." });
    res.json({ auction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/auctions/:id", async (req, res) => {
  try {
    await Auction.findByIdAndDelete(req.params.id);
    res.json({ message: "Auction deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Orders ────────────────────────────────────────────────────────────────────
router.get("/orders", async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { orderStatus: status } : {};
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate({ path: "auction", populate: { path: "Product", select: "name image" } })
        .populate("winner", "fullName email")
        .populate("seller", "fullName email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/orders/:id", async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const allowedOrderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    const allowedPaymentStatuses = ["pending", "paid", "failed", "refunded"];
    const update = {};
    if (orderStatus !== undefined) {
      if (!allowedOrderStatuses.includes(orderStatus)) {
        return res.status(400).json({ message: `orderStatus must be one of: ${allowedOrderStatuses.join(", ")}` });
      }
      update.orderStatus = orderStatus;
    }
    if (paymentStatus !== undefined) {
      if (!allowedPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({ message: `paymentStatus must be one of: ${allowedPaymentStatuses.join(", ")}` });
      }
      update.paymentStatus = paymentStatus;
    }
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
