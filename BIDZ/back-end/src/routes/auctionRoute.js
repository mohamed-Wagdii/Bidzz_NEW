import express from "express";
import { createAuction, updateAuctions, deleteAuction, getAllAuctions, getAuctionById, getMyAuctions, endAuction } from "../controller/auctionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /create
 * Creates a new auction instance. Requires authentication.
 */
router.post("/create", authMiddleware, createAuction);

/**
 * PUT /update/:id
 * Updates an existing auction's details. Requires authentication.
 */
router.put("/update/:id", authMiddleware, updateAuctions);

/**
 * DELETE /delete/:id
 * Deletes a specified auction. Requires authentication.
 */
router.delete("/delete/:id", authMiddleware, deleteAuction);

/**
 * PATCH /end/:id
 * Manually ends an active auction. Requires authentication.
 */
router.patch("/end/:id", authMiddleware, endAuction);

/**
 * GET /all
 * Retrieves all auctions in the platform.
 */
router.get("/all", getAllAuctions);

/**
 * GET /my
 * Retrieves all auctions created by the currently authenticated user.
 */
router.get("/my", authMiddleware, getMyAuctions);

/**
 * GET /:id
 * Retrieves detailed information about a specific auction by ID.
 */
router.get("/:id", getAuctionById);

export default router;
