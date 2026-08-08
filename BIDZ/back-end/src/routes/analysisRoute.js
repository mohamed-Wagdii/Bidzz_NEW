import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdmin.js";
import { getDashboard, getAnalytics } from "../controller/analysisController.js";

const router = express.Router();

// GET /api/analysis/dashboard — role-aware stats (buyer/seller)
/**
 * GET /dashboard
 * Returns personalized dashboard statistics depending on whether the user is a buyer or seller.
 */
router.get("/dashboard", authMiddleware, getDashboard);

// GET /api/analysis/platform — platform-wide metrics (admin only)
// Note: Frontend calls this "analytics", so the path is "/" but mounted on /api/analysis or similar.
// Wait, I will mount this on /api/analysis
/**
 * GET /
 * Returns platform-wide analytical metrics for administrators.
 */
router.get("/", authMiddleware, isAdmin, getAnalytics);

export default router;
