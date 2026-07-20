import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getWallet, addBalance, withdrawBalance, getTransactions } from "../controller/walletController.js";

const router = express.Router();

router.get("/", authMiddleware, getWallet);
router.post("/deposit", authMiddleware, addBalance);
router.post("/withdraw", authMiddleware, withdrawBalance);
router.get("/transactions", authMiddleware, getTransactions);

export default router;
