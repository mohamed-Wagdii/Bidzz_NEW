import Auction from "../models/Auctions.js";
import Bid from "../models/Bid.js";
import { createAndEmitNotification } from "./notification.js";
import { maybeExpireAuction } from "./auctionController.js";
import { ensureWalletForUser, lockFunds, unlockFunds } from "./walletController.js";

/**
 * Place a new bid
 * - Receives the bid amount and the auction ID.
 * - Checks if the auction is active and that the user is not bidding on their own auction.
 * - Validates that the bid is higher than the current price.
 * - Locks the funds from the buyer's wallet and unlocks funds for the previous highest bidder if one exists.
 * - Sends notifications to the seller and the previous bidder (if outbid).
 */
export const placeBid = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { amount: rawAmount } = req.body;

    const amount = parseFloat(rawAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: "Bid amount must be a positive number" });
    }

    let auction = await Auction.findById(auctionId).populate("Product");
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    // Auto-expire before checking status — prevents bids on time-expired auctions
    auction = await maybeExpireAuction(auction);

    if (auction.status !== "active") {
      return res.status(400).json({ message: "Auction is not active" });
    }

    if (auction.seller.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot bid on your own auction" });
    }

    const highestBid = await Bid.findOne({ auction: auctionId }).sort({ amount: -1 });
    const currentPrice = highestBid?.amount || auction.startingPrice;

    if (amount <= currentPrice) {
      return res.status(400).json({ message: `Bid must be greater than ${currentPrice}` });
    }

    await ensureWalletForUser(req.user._id);

    const previousBid = await Bid.findOne({ auction: auctionId, buyer: req.user._id }).sort({ amount: -1 });
    const previousAmount = previousBid?.amount || 0;
    const delta = amount - previousAmount;

    if (delta > 0) {
      if (previousAmount > 0) {
        await unlockFunds(req.user._id, previousAmount, `Unlocked prior bid on auction ${auctionId}`, auction._id);
      }
      await lockFunds(req.user._id, delta, `Locked bid funds for auction ${auctionId}`, auction._id);
    }

    const bid = await Bid.create({ auction: auctionId, buyer: req.user._id, amount });

    auction.highestBider = req.user._id;
    if (!auction.participants.some(p => p.toString() === req.user._id.toString())) {
      auction.participants.push(req.user._id);
    }
    await auction.save();

    // Notify seller of new bid
    createAndEmitNotification({
      receiver: auction.seller,
      sender: req.user._id,
      type: "bid",
      title: "New Bid Placed",
      message: `${req.user.fullName} placed a bid of $${amount} on your auction.`,
      relatedId: auction._id,
    }).catch(() => { });

    // Notify previous highest bidder they've been outbid
    if (highestBid && highestBid.buyer.toString() !== req.user._id.toString()) {
      createAndEmitNotification({
        receiver: highestBid.buyer,
        sender: req.user._id,
        type: "outbid",
        title: "You've Been Outbid!",
        message: `Someone placed a higher bid of $${amount} on "${auction.Product?.name}". Bid again to stay in the lead!`,
        relatedId: auction._id,
      }).catch(() => { });
    }

    res.status(201).json({ message: "Bid placed successfully", bid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieve all bids for a specific auction
 * - Receives the auction ID.
 * - Returns a list of all bids placed on it, sorted from highest to lowest.
 * - Includes the bidder's information (name and email).
 */
export const getBidsForAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const bids = await Bid.find({ auction: auctionId })
      .populate("buyer", "fullName email")
      .sort({ amount: -1 });
    res.status(200).json({ bids });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieve all bids for the current user (My Bids)
 * - Uses the user's Token to identify them (req.user._id).
 * - Returns all bids placed by the user across any auction, sorted by newest.
 * - Includes auction and product details (name and image) with each bid to be displayed in the Dashboard.
 */
export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ buyer: req.user._id })
      .populate({
        path: "auction",
        populate: [
          { path: "Product", select: "name image" },
          { path: "highestBider", select: "_id" },
        ],
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ bids });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
