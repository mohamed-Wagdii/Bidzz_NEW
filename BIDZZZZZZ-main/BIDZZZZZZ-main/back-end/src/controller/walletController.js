import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";

export const ensureWalletForUser = async (userId) => {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await Wallet.create({ user: userId, balance: 0, lockedBalance: 0, escrowBalance: 0 });
  }
  return wallet;
};

const logTransaction = async ({ user, type, amount, status = "completed", description, relatedAuction = null, relatedOrder = null }) => {
  return WalletTransaction.create({ user, type, amount, status, description, relatedAuction, relatedOrder });
};

export const getWallet = async (req, res) => {
  try {
    const wallet = await ensureWalletForUser(req.user._id);
    res.json({ wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Amount must be positive" });

    const wallet = await ensureWalletForUser(req.user._id);
    wallet.balance += Number(amount);
    await wallet.save();

    await logTransaction({ user: req.user._id, type: "deposit", amount: Number(amount), description: "Wallet deposit" });

    res.json({ message: "Deposit successful", wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const withdrawBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Amount must be positive" });

    const wallet = await ensureWalletForUser(req.user._id);
    const value = Number(amount);

    if (wallet.balance < value) return res.status(400).json({ message: "Insufficient balance" });

    wallet.balance -= value;
    await wallet.save();

    await logTransaction({ user: req.user._id, type: "withdraw", amount: value, description: "Wallet withdrawal" });

    res.json({ message: "Withdrawal successful", wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await WalletTransaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const lockFunds = async (userId, amount, description, relatedAuction = null) => {
  const wallet = await ensureWalletForUser(userId);
  if (wallet.balance < amount) throw new Error("Insufficient balance to lock funds");
  wallet.balance -= amount;
  wallet.lockedBalance += amount;
  await wallet.save();
  await logTransaction({ user: userId, type: "bid_lock", amount, description, relatedAuction });
};

export const unlockFunds = async (userId, amount, description, relatedAuction = null) => {
  const wallet = await ensureWalletForUser(userId);
  if (wallet.lockedBalance < amount) throw new Error("Insufficient locked balance");
  wallet.lockedBalance -= amount;
  wallet.balance += amount;
  await wallet.save();
  await logTransaction({ user: userId, type: "bid_unlock", amount, description, relatedAuction });
};

export const chargeWinningBid = async (userId, amount, description, relatedAuction = null) => {
  const wallet = await ensureWalletForUser(userId);
  if (wallet.lockedBalance < amount) throw new Error("Insufficient locked balance to charge escrow");
  wallet.lockedBalance -= amount;
  wallet.escrowBalance += amount;
  await wallet.save();
  await logTransaction({ user: userId, type: "order_charge", amount, description, relatedAuction });
};

export const releaseEscrowToSeller = async (userId, amount, description, relatedOrder = null) => {
  const wallet = await ensureWalletForUser(userId);
  if (wallet.escrowBalance < amount) throw new Error("Insufficient escrow balance");
  wallet.escrowBalance -= amount;
  wallet.balance += amount;
  await wallet.save();
  await logTransaction({ user: userId, type: "escrow_release", amount, description, relatedOrder });
};
