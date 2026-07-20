import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";
import User from "../models/User.js";

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
    const value = parseFloat(req.body.amount);
    if (!Number.isFinite(value) || value <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }
    if (value > 10000) {
      return res.status(400).json({ message: "Single deposit cannot exceed $10,000" });
    }

    const wallet = await ensureWalletForUser(req.user._id);
    wallet.balance += value;
    await wallet.save();

    await logTransaction({ user: req.user._id, type: "deposit", amount: value, description: "Wallet deposit" });

    res.json({ message: "Deposit successful", wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const withdrawBalance = async (req, res) => {
  try {
    const value = parseFloat(req.body.amount);
    if (!Number.isFinite(value) || value <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    const wallet = await ensureWalletForUser(req.user._id);

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
  const buyerWallet = await ensureWalletForUser(userId);
  if (buyerWallet.balance < amount) throw new Error("Insufficient balance to lock funds");

  const adminUser = await User.findOne({ role: "admin" });
  if (!adminUser) throw new Error("Admin account not found");
  const adminWallet = await ensureWalletForUser(adminUser._id);

  buyerWallet.balance -= amount;
  await buyerWallet.save();
  await logTransaction({ user: userId, type: "bid_lock", amount, status: "pending", description, relatedAuction });

  adminWallet.escrowBalance += amount;
  await adminWallet.save();
  await logTransaction({ user: adminUser._id, type: "escrow_hold", amount, status: "pending", description: `Escrow hold for ${description}`, relatedAuction });
};

export const unlockFunds = async (userId, amount, description, relatedAuction = null) => {
  const adminUser = await User.findOne({ role: "admin" });
  if (!adminUser) throw new Error("Admin account not found");
  const adminWallet = await ensureWalletForUser(adminUser._id);

  if (adminWallet.escrowBalance < amount) throw new Error("Insufficient admin escrow balance");

  adminWallet.escrowBalance -= amount;
  await adminWallet.save();
  
  // Mark previous pending holds as failed since they are being reversed
  if (relatedAuction) {
    await WalletTransaction.updateMany(
      { relatedAuction, user: adminUser._id, type: "escrow_hold", status: "pending" },
      { $set: { status: "failed" } }
    );
    await WalletTransaction.updateMany(
      { relatedAuction, user: userId, type: "bid_lock", status: "pending" },
      { $set: { status: "failed" } }
    );
  }

  await logTransaction({ user: adminUser._id, type: "escrow_release", amount, description: `Escrow reversed for ${description}`, relatedAuction });

  const buyerWallet = await ensureWalletForUser(userId);
  buyerWallet.balance += amount;
  await buyerWallet.save();
  await logTransaction({ user: userId, type: "bid_unlock", amount, description, relatedAuction });
};
