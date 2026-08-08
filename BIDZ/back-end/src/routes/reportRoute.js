import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { submitReport, getMyReports, getAllReports, resolveReport, getReportStats } from "../controller/reportController.js";

const router = express.Router();

/**
 * Middleware to restrict access to admin users only.
 * Checks the user's role and denies access if they are not an admin.
 */
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin access required." });
  next();
};

/**
 * POST /
 * Submits a new report or issue from the user.
 */
router.post("/", authMiddleware, submitReport);

/**
 * GET /my
 * Retrieves a list of reports submitted by the currently authenticated user.
 */
router.get("/my", authMiddleware, getMyReports);

/**
 * GET /
 * Retrieves a paginated list of all reports (Admin only).
 */
router.get("/", authMiddleware, adminOnly, getAllReports);

/**
 * GET /stats
 * Aggregates and returns statistics on reports (Admin only).
 */
router.get("/stats", authMiddleware, adminOnly, getReportStats);

/**
 * PATCH /:id/resolve
 * Marks a specific report as resolved (Admin only).
 */
router.patch("/:id/resolve", authMiddleware, adminOnly, resolveReport);

export default router;
