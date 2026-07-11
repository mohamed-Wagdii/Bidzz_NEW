import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { submitReport, getMyReports, getAllReports, resolveReport, getReportStats } from "../controller/reportController.js";

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin access required." });
  next();
};

router.post("/", authMiddleware, submitReport);
router.get("/my", authMiddleware, getMyReports);
router.get("/", authMiddleware, adminOnly, getAllReports);
router.get("/stats", authMiddleware, adminOnly, getReportStats);
router.patch("/:id/resolve", authMiddleware, adminOnly, resolveReport);

export default router;
