import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";
import User from "../models/User.js";

const getOrCreateWallet = async (userId) => {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await Wallet.create({ user: userId, balance: 0, lockedBalance: 0, escrowBalance: 0 });
  }
  return wallet;
};

export const ensureWalletForUser = async (userId) => {
  return getOrCreateWallet(userId);
};

export const getWallet = async (req, res) => {
  try {
    const wallet = await getOrCreateWallet(req.user._id);
    const transactions = await WalletTransaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json({ wallet, transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    const wallet = await getOrCreateWallet(req.user._id);
    wallet.balance += parsedAmount;
    await wallet.save();

    await WalletTransaction.create({
      user: req.user._id,
      type: "deposit",
      amount: parsedAmount,
      description: "Balance added via fake deposit",
      status: "completed",
    });

    res.status(200).json({ message: "Balance added successfully", wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const withdrawBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    const wallet = await getOrCreateWallet(req.user._id);
    if (wallet.balance < parsedAmount) {
      return res.status(400).json({ message: "Insufficient available balance" });
    }

    wallet.balance -= parsedAmount;
    await wallet.save();

    await WalletTransaction.create({
      user: req.user._id,
      type: "withdraw",
      amount: parsedAmount,
      description: "Balance withdrawn",
      status: "completed",
    });

    res.status(200).json({ message: "Withdrawal successful", wallet });
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
  const wallet = await getOrCreateWallet(userId);
  if (wallet.balance < amount) {
    throw new Error("Insufficient balance to lock funds");
  }
  wallet.balance -= amount;
  wallet.lockedBalance += amount;
  await wallet.save();

  await WalletTransaction.create({
    user: userId,
    type: "bid_lock",
    amount,
    description,
    relatedAuction,
    status: "completed",
  });

  return wallet;
};

export const unlockFunds = async (userId, amount, description, relatedAuction = null) => {
  const wallet = await getOrCreateWallet(userId);
  if (wallet.lockedBalance < amount) {
    throw new Error("Insufficient locked balance to unlock");
  }
  wallet.lockedBalance -= amount;
  wallet.balance += amount;
  await wallet.save();

  await WalletTransaction.create({
    user: userId,
    type: "bid_unlock",
    amount,
    description,
    relatedAuction,
    status: "completed",
  });

  return wallet;
};

export const chargeWinningBid = async (userId, amount, description, relatedAuction = null, relatedOrder = null) => {
  const wallet = await getOrCreateWallet(userId);
  if (wallet.lockedBalance < amount) {
    throw new Error("Insufficient locked balance to charge" );
  }
  wallet.lockedBalance -= amount;
  wallet.escrowBalance += amount;
  await wallet.save();

  await WalletTransaction.create({
    user: userId,
    type: "order_charge",
    amount,
    description,
    relatedAuction,
    relatedOrder,
    status: "completed",
  });

  return wallet;
};

export const releaseEscrowToSeller = async (sellerId, amount, description, relatedOrder = null) => {
  const wallet = await getOrCreateWallet(sellerId);
  wallet.escrowBalance -= amount;
  wallet.balance += amount;
  await wallet.save();

  await WalletTransaction.create({
    user: sellerId,
    type: "escrow_release",
    amount,
    description,
    relatedOrder,
    status: "completed",
  });

  return wallet;
};
