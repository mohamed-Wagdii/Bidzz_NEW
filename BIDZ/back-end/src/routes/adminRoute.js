import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  getUsers,
  updateUser,
  deleteUser,
  getAuctions,
  endAuction,
  deleteAuction,
  getOrders,
  updateOrder,
  getFinances
} from "../controller/adminController.js";

const router = express.Router();

/**
 * Require authentication and admin privileges for all routes in this module.
 */
router.use(authMiddleware, isAdmin);

// ── Users ─────────────────────────────────────────────────────────────────────
router.get("/users", getUsers);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// ── Auctions ──────────────────────────────────────────────────────────────────
router.get("/auctions", getAuctions);
router.patch("/auctions/:id/end", endAuction);
router.delete("/auctions/:id", deleteAuction);

// ── Orders ────────────────────────────────────────────────────────────────────
router.get("/orders", getOrders);
router.patch("/orders/:id", updateOrder);

// ── Finances ──────────────────────────────────────────────────────────────────
router.get("/finances", getFinances);

export default router;
