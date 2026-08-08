import express from "express";
import { placeBid, getBidsForAuction, getMyBids } from "../controller/bidController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /:auctionId
 * Places a new bid on a specific auction. Requires authentication.
 */
router.post("/:auctionId", authMiddleware, placeBid);

/**
 * GET /auction/:auctionId
 * Retrieves all bids for a specific auction.
 */
router.get("/auction/:auctionId", getBidsForAuction);

/**
 * GET /my
 * Retrieves all bids placed by the currently authenticated user.
 */
router.get("/my", authMiddleware, getMyBids);

export default router;
