import express from "express";
import { createAuction, updateAuctions, deleteAuction, getAllAuctions, getAuctionById, getMyAuctions, endAuction } from "../controller/auctionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createAuction);
router.put("/update/:id", authMiddleware, updateAuctions);
router.delete("/delete/:id", authMiddleware, deleteAuction);
router.patch("/end/:id", authMiddleware, endAuction);
router.get("/all", getAllAuctions);
router.get("/my", authMiddleware, getMyAuctions);
router.get("/:id", getAuctionById);

export default router;
