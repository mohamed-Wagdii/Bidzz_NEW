import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getWallet, addBalance, withdrawBalance, getTransactions } from "../controller/walletController.js";

const router = express.Router();

/**
 * GET /
 * Retrieves the authenticated user's wallet balance and details.
 */
router.get("/", authMiddleware, getWallet);

/**
 * POST /deposit
 * Adds funds to the user's wallet balance.
 */
router.post("/deposit", authMiddleware, addBalance);

/**
 * POST /withdraw
 * Initiates a withdrawal request from the user's wallet.
 */
router.post("/withdraw", authMiddleware, withdrawBalance);

/**
 * GET /transactions
 * Retrieves a history of transactions associated with the user's wallet.
 */
router.get("/transactions", authMiddleware, getTransactions);

export default router;
