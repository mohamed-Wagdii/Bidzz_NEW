import Report from "../models/Report.js";
import User from "../models/User.js";
import Auction from "../models/Auctions.js";
import logger from "../Config/logger.js";

export const submitReport = async (req, res) => {
  try {
    const { targetType, targetId, reason, description } = req.body;
    if (!targetType || !targetId || !reason)
      return res.status(400).json({ message: "targetType, targetId and reason are required." });

    const allowedTargetTypes = ["user", "auction", "product"];
    if (!allowedTargetTypes.includes(targetType)) {
      return res.status(400).json({ message: `targetType must be one of: ${allowedTargetTypes.join(", ")}` });
    }

    const allowedReasons = ["spam", "fraud", "fake_item", "inappropriate", "other"];
    if (!allowedReasons.includes(reason)) {
      return res.status(400).json({ message: `reason must be one of: ${allowedReasons.join(", ")}` });
    }

    // Prevent duplicate pending reports from same user
    const existing = await Report.findOne({
      reporter: req.user._id,
      targetId,
      targetType,
      status: "pending",
    });
    if (existing)
      return res.status(409).json({ message: "You already have a pending report for this item." });

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
      description: description?.slice(0, 1000) || "",
    });

    logger.info("Report submitted", { reportId: report._id, reporter: req.user._id, targetType, reason });
    res.status(201).json({ message: "Report submitted successfully.", report });
  } catch (err) {
    logger.error("submitReport error", { error: err.message });
    res.status(500).json({ message: "Server error." });
  }
};


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

export const getAllReports = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate("reporter", "fullName email role")
        .populate("resolvedBy", "fullName")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Report.countDocuments(filter),
    ]);
    res.json({ reports, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

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

export const getReportStats = async (req, res) => {
  try {
    const [pending, resolved, rejected] = await Promise.all([
      Report.countDocuments({ status: "pending" }),
      Report.countDocuments({ status: "resolved" }),
      Report.countDocuments({ status: "rejected" }),
    ]);
    res.json({ pending, resolved, rejected, total: pending + resolved + rejected });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
