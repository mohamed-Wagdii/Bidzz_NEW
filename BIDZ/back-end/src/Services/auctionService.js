import Auction from "../models/Auctions.js";

/**
 * Checks if a user has access to a specific auction.
 * A user has access if they are the seller or a participant (bidder).
 * @param {string} userId - The user's ID
 * @param {string} auctionId - The auction's ID
 * @returns {Promise<{hasAccess: boolean, error: string | null}>}
 */
export const verifyAuctionAccess = async (userId, auctionId) => {
  try {
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return { hasAccess: false, error: "Auction not found" };
    }

    const isSeller = auction.seller.toString() === userId.toString();
    const isBidder = auction.participants?.some((p) => p.toString() === userId.toString());

    if (!isSeller && !isBidder) {
      return { hasAccess: false, error: "Not allowed to access this auction" };
    }

    return { hasAccess: true, error: null };
  } catch (error) {
    return { hasAccess: false, error: "Server error checking access" };
  }
};
