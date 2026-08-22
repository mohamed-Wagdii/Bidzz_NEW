import Report from "../models/Report.js";
import User from "../models/User.js";
import Auction from "../models/Auctions.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import logger from "../Config/logger.js";

/**
 * Submit Report
 * Allows a user to submit a report against a seller, buyer, auction, message, order, or product.
 * Validates the report type and reason, and prevents duplicate pending reports.
 */
export const submitReport = async (req, res) => {
  try {
    console.log("==> submitReport called with body:", req.body);
    const { targetType, targetId, reason, description } = req.body;
    if (!targetType || !targetId || !reason) {
      console.log("==> submitReport returning 400 (missing fields)");
      return res.status(400).json({ message: "targetType, targetId and reason are required." });
    }

    const allowedTargetTypes = ["seller", "buyer", "auction", "message", "order", "product"];
    if (!allowedTargetTypes.includes(targetType)) {
      return res.status(400).json({ message: `targetType must be one of: ${allowedTargetTypes.join(", ")}` });
    }

    const allowedReasons = ["spam", "fraud", "fake_product", "abusive_language", "scam", "other"];
    if (!allowedReasons.includes(reason)) {
      return res.status(400).json({ message: `reason must be one of: ${allowedReasons.join(", ")}` });
    }

    console.log("==> submitReport checking existing report");
    // Prevent duplicate pending reports from same user
    const existing = await Report.findOne({
      reporter: req.user._id,
      targetId,
      targetType,
      status: "pending",
    });
    if (existing) {
      console.log("==> submitReport returning 409 (duplicate)");
      return res.status(409).json({ message: "You already have a pending report for this item." });
    }

    console.log("==> submitReport creating report");

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
      description: description?.slice(0, 1000) || "",
    });

    console.log("==> submitReport success:", report._id);
    logger.info("Report submitted", { reportId: report._id, reporter: req.user._id, targetType, reason });
    res.status(201).json({ message: "Report submitted successfully.", report });
  } catch (err) {
    logger.error("submitReport error", { error: err.message });
    res.status(500).json({ message: "Server error." });
  }
};


/**
 * Get My Reports
 * Retrieves the last 50 reports submitted by the currently authenticated user.
 */
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// ── Admin only ──────────────────────────────────────────────────────────────

/**
 * Get All Reports (Admin)
 * Fetches a paginated list of all reports across the platform.
 * Hydrates the reports with target names (e.g., user name, product name) dynamically.
 */
export const getAllReports = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const reportsRaw = await Report.find(filter)
      .populate("reporter", "fullName email role")
      .populate("resolvedBy", "fullName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
      
    const total = await Report.countDocuments(filter);

    const reports = [];
    for (const r of reportsRaw) {
      const rep = r.toObject();
      rep.targetName = "Unknown";
      try {
        if (r.targetType === "buyer" || r.targetType === "seller") {
          const u = await User.findById(r.targetId).select("fullName");
          if (u) rep.targetName = u.fullName;
        } else if (r.targetType === "auction") {
          const a = await Auction.findById(r.targetId).populate("Product", "name");
          if (a && a.Product) rep.targetName = a.Product.name + " (Auction)";
        } else if (r.targetType === "product") {
          const p = await Product.findById(r.targetId).select("name");
          if (p) rep.targetName = p.name;
        } else if (r.targetType === "order") {
          rep.targetName = `Order #${r.targetId}`;
        }
      } catch (e) {
        // ignore fetch errors for invalid IDs
      }
      reports.push(rep);
    }

    res.json({ reports, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * Resolve Report (Admin)
 * Allows an admin to resolve a report by specifying an action (e.g., ban, suspend, delete_auction).
 * Applies the corresponding penalty to the reported target.
 */
export const resolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, adminNote, status } = req.body;

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: "Report not found." });

    report.status = status || "resolved";
    report.action = action || "none";
    report.adminNote = adminNote || "";
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();
    await report.save();

    // Apply action
    if (action === "ban" || action === "suspend") {
      await User.findByIdAndUpdate(report.targetId, {
        lockUntil: action === "ban" ? new Date("2099-01-01") : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    } else if (action === "delete_auction") {
      await Auction.findByIdAndDelete(report.targetId);
    }

    logger.info("Report resolved", { reportId: id, action, resolvedBy: req.user._id });
    res.json({ message: "Report resolved.", report });
  } catch (err) {
    logger.error("resolveReport error", { error: err.message });
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * Get Report Stats (Admin)
 * Returns the counts of pending, resolved, and rejected reports for the admin dashboard.
 */
export const getReportStats = async (req, res) => {
  try {
    const pending = await Report.countDocuments({ status: "pending" });
    const resolved = await Report.countDocuments({ status: "resolved" });
    const rejected = await Report.countDocuments({ status: "rejected" });
    res.json({ pending, resolved, rejected, total: pending + resolved + rejected });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
