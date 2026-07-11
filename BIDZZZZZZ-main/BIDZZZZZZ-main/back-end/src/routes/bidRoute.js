import express from "express";
import { placeBid, getBidsForAuction, getMyBids } from "../controller/bidController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:auctionId", authMiddleware, placeBid);
router.get("/auction/:auctionId", getBidsForAuction);
router.get("/my", authMiddleware, getMyBids);

export default router;
