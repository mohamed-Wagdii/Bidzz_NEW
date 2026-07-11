import Product from "../models/Product.js";
import Auction from "../models/Auctions.js";
import Bid from "../models/Bid.js";
import Ticket from "../models/Ticket.js";
import { createAndEmitNotification } from "./notification.js";
import { ingestAuction } from "../AI/ingestAuctions.js";
import { chargeWinningBid, unlockFunds } from "./walletController.js";

// ─── Shared helper: expire an auction that has passed its endTime ─────────────
// Returns the (possibly mutated) auction. Safe to call multiple times.
export async function maybeExpireAuction(auction) {
  if (auction.status !== "active") return auction;
  if (new Date(auction.endTime) > new Date()) return auction;

  // Mark ended
  auction.status = "ended";
  await auction.save();

  // Fire notifications (non-blocking)
  const allBids = await Bid.find({ auction: auction._id }).sort({ amount: -1 });

  if (allBids.length > 0 && auction.highestBider) {
    const sellerId = auction.seller?._id || auction.seller;
    const productName = auction.Product?.name || "the item";

    const winnerId = auction.highestBider?.toString();
    const winnerBid = allBids[0];
    const loserIds = [...new Set(allBids.slice(1).map(b => b.buyer.toString()))].filter(id => id !== winnerId);

    if (winnerId) {
      await chargeWinningBid(winnerId, winnerBid.amount, `Escrow locked for winning auction ${auction._id}`, auction._id);
    }

    for (const loserId of loserIds) {
      const loserBidAmount = allBids.find(b => b.buyer.toString() === loserId)?.amount || 0;
      if (loserBidAmount > 0) {
        await unlockFunds(loserId, loserBidAmount, `Unlocked funds after losing auction ${auction._id}`, auction._id);
      }
    }

    createAndEmitNotification({
      receiver: auction.highestBider,
      sender: sellerId,
      type: "auction_won",
      title: "🏆 You Won the Auction!",
      message: `Congratulations! You won the auction for "${productName}" with a bid of $${allBids[0].amount}. Proceed to complete your order.`,
      relatedId: auction._id,
    }).catch(() => {});

    loserIds.forEach(loserId => {
      createAndEmitNotification({
        receiver: loserId,
        sender: sellerId,
        type: "auction_lost",
        title: "Auction Ended",
        message: `The auction for "${productName}" has ended. Unfortunately you did not win this time.`,
        relatedId: auction._id,
      }).catch(() => {});
    });
  }

  return auction;
}

// ─── Create auction ───────────────────────────────────────────────────────────
export const createAuction = async (req, res) => {
  try {
    const { productId, startingPrice, endTime, ticketId } = req.body;

    if (!ticketId) return res.status(400).json({ message: "Ticket ID is required." });

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (ticket.used) return res.status(400).json({ message: "Ticket already used" });
    if (ticket.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not your ticket" });
    if (ticket.expiresAt < new Date()) return res.status(400).json({ message: "Ticket expired" });

    if (!productId || !startingPrice || !endTime) {
      return res.status(400).json({ message: "Product ID, starting price and end time are required." });
    }
    if (req.user.role !== "seller") return res.status(403).json({ message: "Only sellers can create auctions." });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found." });
    if (product.seller.toString() !== req.user._id.toString()) return res.status(403).json({ message: "You are not the seller of this product" });
    if (product.status !== "approved") return res.status(400).json({ message: "Product is not available for auction." });
    if (new Date(endTime) <= new Date()) return res.status(400).json({ message: "End time must be in the future." });

    const auction = await Auction.create({
      Product: productId,
      seller: req.user._id,
      startingPrice: parseFloat(startingPrice),
      endTime,
      startTime: new Date(),
      status: "active",
    });

    ticket.used = true;
    await ticket.save();

    // Ingest into RAG (non-blocking)
    ingestAuction(auction, product, req.user).catch(() => {});

    return res.status(201).json({ message: "Auction created successfully.", auction });
  } catch (error) {
    return res.status(500).json({ message: "Error creating auction.", error: error.message });
  }
};

// ─── Get all active auctions (auto-expire stale ones first) ──────────────────
export const getAllAuctions = async (req, res) => {
  try {
    // Auto-expire any active auctions whose endTime has passed
    const stale = await Auction.find({
      status: "active",
      endTime: { $lte: new Date() },
    });
    await Promise.all(stale.map(a => maybeExpireAuction(a)));

    const auctions = await Auction.find({ status: "active" })
      .populate("Product")
      .populate("seller", "fullName email")
      .populate("highestBider", "fullName");

    return res.status(200).json({ message: "success", auctions });
  } catch (error) {
    return res.status(500).json({ message: "error", error: error.message });
  }
};

// ─── Get auction by ID (auto-expire if needed) ────────────────────────────────
export const getAuctionById = async (req, res) => {
  try {
    const { id } = req.params;

    let auction = await Auction.findById(id)
      .populate("Product")
      .populate("seller")
      .populate("highestBider");

    if (!auction) return res.status(404).json({ message: "Auction not found" });

    // Auto-expire if time has passed but status is still active
    auction = await maybeExpireAuction(auction);

    return res.status(200).json({ message: "success", auction });
  } catch (error) {
    return res.status(500).json({ message: "error", error: error.message });
  }
};

// ─── Update auction ───────────────────────────────────────────────────────────
export const updateAuctions = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, startingPrice } = req.body;

    const auction = await Auction.findById(id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (req.user.role !== "admin" && req.user._id.toString() !== auction.seller.toString()) {
      return res.status(403).json({ message: "Not allowed to update auctions." });
    }

    if (auction.status === "pending") {
      if (startTime) auction.startTime = startTime;
      if (endTime) auction.endTime = endTime;
      if (startingPrice) auction.startingPrice = startingPrice;
    } else if (auction.status === "active") {
      if (endTime) {
        const newEndTime = new Date(endTime);
        if (newEndTime <= new Date()) return res.status(400).json({ message: "End time must be in the future." });
        auction.endTime = newEndTime;
      }
    } else {
      return res.status(400).json({ message: "Only pending or active auctions can be updated." });
    }

    await auction.save();
    return res.status(200).json({ message: "Auction updated successfully", auction });
  } catch (error) {
    return res.status(500).json({ message: "Error updating auction.", error: error.message });
  }
};

// ─── Delete auction ───────────────────────────────────────────────────────────
export const deleteAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await Auction.findById(id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });
    if (req.user.role !== "admin" && req.user._id.toString() !== auction.seller.toString()) {
      return res.status(403).json({ message: "Not allowed to delete auctions." });
    }
    await Auction.findByIdAndDelete(id);
    return res.status(200).json({ message: "Auction deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting auction.", error: error.message });
  }
};

// ─── End auction manually (seller / admin) ────────────────────────────────────
export const endAuction = async (req, res) => {
  try {
    const { id } = req.params;

    let auction = await Auction.findById(id).populate("Product").populate("seller");
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    const sellerId = auction.seller?._id?.toString() || auction.seller?.toString();
    if (sellerId !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (auction.status === "ended") {
      return res.status(200).json({ message: "Auction already ended", auction });
    }

    auction = await maybeExpireAuction(auction);

    // If endTime hasn't passed yet, force-end it now
    if (auction.status !== "ended") {
      auction.status = "ended";
      await auction.save();

      const allBids = await Bid.find({ auction: id }).sort({ amount: -1 });
      if (allBids.length > 0 && auction.highestBider) {
        const productName = auction.Product?.name || "the item";
        createAndEmitNotification({
          receiver: auction.highestBider,
          sender: auction.seller._id,
          type: "auction_won",
          title: "🏆 You Won the Auction!",
          message: `Congratulations! You won the auction for "${productName}" with a bid of $${allBids[0].amount}. Proceed to complete your order.`,
          relatedId: auction._id,
        }).catch(() => {});

        const loserIds = [...new Set(allBids.slice(1).map(b => b.buyer.toString()))]
          .filter(lid => lid !== auction.highestBider.toString());
        loserIds.forEach(loserId => {
          createAndEmitNotification({
            receiver: loserId,
            sender: auction.seller._id,
            type: "auction_lost",
            title: "Auction Ended",
            message: `The auction for "${productName}" has ended. Unfortunately you did not win this time.`,
            relatedId: auction._id,
          }).catch(() => {});
        });
      }
    }

    return res.status(200).json({ message: "Auction ended successfully", auction });
  } catch (error) {
    return res.status(500).json({ message: "Error ending auction", error: error.message });
  }
};

// ─── Get my auctions (seller) — auto-expire stale ones ───────────────────────
export const getMyAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ seller: req.user._id })
      .populate("Product")
      .sort({ createdAt: -1 });

    // Auto-expire any that have passed their endTime
    const resolved = await Promise.all(auctions.map(a => maybeExpireAuction(a)));

    const auctionsWithCounts = await Promise.all(
      resolved.map(async (a) => {
        const bidCount = await Bid.countDocuments({ auction: a._id });
        const topBid = await Bid.findOne({ auction: a._id }).sort({ amount: -1 });
        const obj = a.toObject();
        obj.bidCount = bidCount;
        obj.currentPrice = topBid?.amount || a.startingPrice;
        return obj;
      })
    );

    return res.status(200).json({ message: "success", auctions: auctionsWithCounts });
  } catch (error) {
    return res.status(500).json({ message: "error", error: error.message });
  }
};

export default { createAuction, getAllAuctions, deleteAuction, updateAuctions, getAuctionById, getMyAuctions, endAuction };
