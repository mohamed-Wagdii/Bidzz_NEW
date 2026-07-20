import express from "express";
import { register, login } from "../controller/authController.js";
import { requestPasswordReset, resetPassword } from "../controller/passwordResetController.js";
import { googleLogin } from "../controller/googleAuthController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Auction from "../models/Auctions.js";
import Bid from "../models/Bid.js";
import Order from "../models/Order.js";
import Ticket from "../models/Ticket.js";
import Wallet from "../models/Wallet.js";
import Report from "../models/Report.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

// GET /api/auth/profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -loginAttempts -lockUntil");
    res.json({ user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/dashboard — role-aware stats
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const wallet = await Wallet.findOne({ user: userId });

    if (req.user.role === "seller") {
      const myAuctions = await Auction.find({ seller: userId });
      const auctionIds = myAuctions.map(a => a._id);
      const [totalBids, orders, pendingOrders, deliveredOrders] = await Promise.all([
        Bid.countDocuments({ auction: { $in: auctionIds } }),
        Order.find({ seller: userId }).populate("winner", "fullName email").sort({ createdAt: -1 }).limit(5),
        Order.countDocuments({ seller: userId, orderStatus: "pending" }),
        Order.countDocuments({ seller: userId, orderStatus: "delivered" }),
      ]);
      const revenueAgg = await Order.aggregate([
        { $match: { seller: userId, paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$finalPrice" } } },
      ]);
      const escrowAgg = await Order.aggregate([
        { $match: { seller: userId, paymentStatus: "pending" } },
        { $group: { _id: null, total: { $sum: "$finalPrice" } } },
      ]);
      // Monthly revenue (last 6 months)
      const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); sixMonthsAgo.setDate(1);
      const monthlyRevenue = await Order.aggregate([
        { $match: { seller: userId, paymentStatus: "paid", createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, revenue: { $sum: "$finalPrice" }, count: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
      return res.json({
        role: "seller",
        totalAuctions: myAuctions.length,
        activeAuctions: myAuctions.filter(a => a.status === "active").length,
        completedAuctions: myAuctions.filter(a => a.status === "ended").length,
        totalBidsReceived: totalBids,
        pendingOrders,
        deliveredOrders,
        totalRevenue: revenueAgg[0]?.total ?? 0,
        escrowBalance: escrowAgg[0]?.total ?? 0,
        walletBalance: wallet?.balance ?? 0,
        recentBuyers: orders.map(o => ({ id: o._id, buyer: o.winner?.fullName, amount: o.finalPrice, status: o.orderStatus })),
        monthlyRevenue,
      });
    }

    // buyer
    const [myBids, wonAuctions, orders] = await Promise.all([
      Bid.find({ buyer: userId })
        .populate({ path: "auction", populate: { path: "Product", select: "name image" } })
        .sort({ createdAt: -1 }),
      Order.countDocuments({ winner: userId, paymentStatus: "paid" }),
      Order.countDocuments({ winner: userId }),
    ]);

    // Bid activity last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const bidActivity = await Bid.aggregate([
      { $match: { buyer: userId, createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return res.json({
      role: "buyer",
      activeBids: myBids.filter(b => b.auction?.status === "active").length,
      auctionsWon: wonAuctions,
      totalOrders: orders,
      walletBalance: wallet?.balance ?? 0,
      lockedBalance: wallet?.lockedBalance ?? 0,
      escrowBalance: wallet?.escrowBalance ?? 0,
      recentBids: myBids.slice(0, 5),
      bidActivity,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/auth/analytics — platform-wide metrics (admin only)
router.get("/analytics", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required." });
  try {
    const [
      totalAuctions, activeAuctions, totalBids, totalOrders,
      completedOrders, totalTickets, totalUsers, totalBuyers,
      totalSellers, pendingReports, recentOrders, recentUsers,
    ] = await Promise.all([
      Auction.countDocuments(),
      Auction.countDocuments({ status: "active" }),
      Bid.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ paymentStatus: "paid", orderStatus: "delivered" }),
      Ticket.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ role: "buyer" }),
      User.countDocuments({ role: "seller" }),
      Report.countDocuments({ status: "pending" }),
      Order.find()
        .populate("product", "name")
        .populate({ path: "auction", populate: { path: "Product", select: "name" } })
        .populate("winner", "fullName")
        .sort({ createdAt: -1 }).limit(5),
      User.find().sort({ createdAt: -1 }).limit(5).select("fullName email role createdAt"),
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$finalPrice" } } },
    ]);

    // Monthly revenue last 6 months
    const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); sixMonthsAgo.setDate(1);
    const monthlyRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, revenue: { $sum: "$finalPrice" }, count: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Top sellers by revenue
    const topSellers = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: "$seller", revenue: { $sum: "$finalPrice" }, orders: { $sum: 1 } } },
      { $sort: { revenue: -1 } }, { $limit: 5 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { name: "$user.fullName", email: "$user.email", revenue: 1, orders: 1 } },
    ]);

    // Wallet totals
    const walletAgg = await Wallet.aggregate([
      { $group: { _id: null, totalBalance: { $sum: "$balance" }, totalEscrow: { $sum: "$escrowBalance" }, totalLocked: { $sum: "$lockedBalance" } } },
    ]);

    res.json({
      totalAuctions, activeAuctions, totalBids, totalOrders,
      completedOrders, totalTickets, totalUsers, totalBuyers, totalSellers,
      pendingReports,
      totalRevenue: revenueAgg[0]?.total ?? 0,
      totalWalletBalance: walletAgg[0]?.totalBalance ?? 0,
      totalEscrow: walletAgg[0]?.totalEscrow ?? 0,
      monthlyRevenue,
      topSellers,
      recentOrders: recentOrders.map(o => ({
        id: o._id, item: o.product?.name ?? o.auction?.Product?.name ?? "Auction Item",
        bid: o.finalPrice, buyer: o.winner?.fullName ?? "Unknown",
        status: o.paymentStatus, orderStatus: o.orderStatus,
      })),
      recentUsers: recentUsers.map(u => ({ id: u._id, name: u.fullName, email: u.email, role: u.role, joinedAt: u.createdAt })),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
