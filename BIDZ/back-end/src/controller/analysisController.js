import Auction from "../models/Auctions.js";
import Bid from "../models/Bid.js";
import Order from "../models/Order.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Report from "../models/Report.js";

/**
 * Get User Dashboard Statistics (Seller or Buyer)
 * - For Sellers: Fetches sales, pending and completed orders, and revenue for the last 6 months.
 * - For Buyers: Fetches number of won auctions, wallet balance, and bidding activity for the last 7 days.
 * - This is the main function that feeds the Dashboard page in the Front-end.
 */
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const wallet = await Wallet.findOne({ user: userId });
    
    // For Sellers
    if (req.user.role === "seller") {
      const myAuctions = await Auction.find({ seller: userId });
      const auctionIds = myAuctions.map((a) => a._id);
      
      const totalBidsReceived = await Bid.countDocuments({ auction: { $in: auctionIds } });
      const orders = await Order.find({ seller: userId }).populate("winner", "fullName email").sort({ createdAt: -1 }).limit(5);
      const pendingOrders = await Order.countDocuments({ seller: userId, orderStatus: "pending" });
      const deliveredOrders = await Order.countDocuments({ seller: userId, orderStatus: "delivered" });
      
      const revenueAgg = await Order.aggregate([
        { $match: { seller: userId, paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$finalPrice" } } }
      ]);
      const totalRevenue = revenueAgg[0]?.total ?? 0;
      
      const escrowAgg = await Order.aggregate([
        { $match: { seller: userId, paymentStatus: "pending" } },
        { $group: { _id: null, total: { $sum: "$finalPrice" } } }
      ]);
      const escrowBalance = escrowAgg[0]?.total ?? 0;
      
      const sixMonthsAgo = new Date(); 
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); 
      sixMonthsAgo.setDate(1);
      
      const monthlyRevenue = await Order.aggregate([
        { $match: { seller: userId, paymentStatus: "paid", createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, revenue: { $sum: "$finalPrice" }, count: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
      
      return res.json({
        role: "seller",
        totalAuctions: myAuctions.length,
        activeAuctions: myAuctions.filter(a => a.status === "active").length,
        completedAuctions: myAuctions.filter(a => a.status === "ended").length,
        totalBidsReceived: totalBidsReceived,
        pendingOrders: pendingOrders,
        deliveredOrders: deliveredOrders,
        totalRevenue: totalRevenue,
        escrowBalance: escrowBalance,
        walletBalance: wallet?.balance ?? 0,
        recentBuyers: orders.map(o => ({ id: o._id, buyer: o.winner?.fullName, amount: o.finalPrice, status: o.orderStatus })),
        monthlyRevenue: monthlyRevenue
      });
    }

    // For Admins (when accessing personal dashboard endpoint inadvertently)
    if (req.user.role === "admin") {
      return res.json({
        role: "admin",
        message: "Detailed admin analytics are fetched via /api/analysis instead of /api/analysis/dashboard."
      });
    }

    // For Buyers
    const myBids = await Bid.find({ buyer: userId })
      .populate({ path: "auction", populate: { path: "Product", select: "name image" } })
      .sort({ createdAt: -1 });
      
    const auctionsWon = await Order.countDocuments({ winner: userId, paymentStatus: "paid" });
    const totalOrders = await Order.countDocuments({ winner: userId });
    
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const bidActivity = await Bid.aggregate([
      { $match: { buyer: userId, createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    return res.json({
      role: "buyer",
      activeBids: myBids.filter(b => b.auction?.status === "active").length,
      auctionsWon: auctionsWon,
      totalOrders: totalOrders,
      walletBalance: wallet?.balance ?? 0,
      lockedBalance: wallet?.lockedBalance ?? 0,
      escrowBalance: wallet?.escrowBalance ?? 0,
      recentBids: myBids.slice(0, 5),
      bidActivity: bidActivity
    });
    
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Get Platform Analytics (Admin Dashboard)
 * - Requires "Admin" privileges to run.
 * - Aggregates data for everything on the platform: total auctions, users, total revenue, orders, and reports.
 * - Displays a list of the top 5 sellers and the latest orders.
 * - This is the main function that feeds the Admin Analytics page in the Front-end.
 */
export const getAnalytics = async (req, res) => {
  try {
    const totalAuctions = await Auction.countDocuments();
    const activeAuctions = await Auction.countDocuments({ status: "active" });
    const totalBids = await Bid.countDocuments();
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ paymentStatus: "paid", orderStatus: "delivered" });
    const totalTickets = await Ticket.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBuyers = await User.countDocuments({ role: "buyer" });
    const totalSellers = await User.countDocuments({ role: "seller" });
    const pendingReports = await Report.countDocuments({ status: "pending" });
    
    const recentOrders = await Order.find()
      .populate("product", "name")
      .populate({ path: "auction", populate: { path: "Product", select: "name" } })
      .populate("winner", "fullName")
      .sort({ createdAt: -1 }).limit(5);
      
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("fullName email role createdAt");

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$finalPrice" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total ?? 0;

    const sixMonthsAgo = new Date(); 
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); 
    sixMonthsAgo.setDate(1);
    
    const monthlyRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, revenue: { $sum: "$finalPrice" }, count: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const topSellers = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: "$seller", revenue: { $sum: "$finalPrice" }, orders: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { name: "$user.fullName", email: "$user.email", revenue: 1, orders: 1 } }
    ]);

    const walletAgg = await Wallet.aggregate([
      { $group: { _id: null, totalBalance: { $sum: "$balance" }, totalEscrow: { $sum: "$escrowBalance" }, totalLocked: { $sum: "$lockedBalance" } } }
    ]);
    const totalWalletBalance = walletAgg[0]?.totalBalance ?? 0;
    const totalEscrow = walletAgg[0]?.totalEscrow ?? 0;

    res.json({
      totalAuctions, activeAuctions, totalBids, totalOrders,
      completedOrders, totalTickets, totalUsers, totalBuyers, totalSellers,
      pendingReports,
      totalRevenue: totalRevenue,
      totalWalletBalance: totalWalletBalance,
      totalEscrow: totalEscrow,
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
};
