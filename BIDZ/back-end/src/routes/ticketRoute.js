import express from "express";
import { buyTicket, getMyTickets } from "../controller/ticketController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /buy
 * Purchases a new ticket for the authenticated user.
 */
router.post("/buy", authMiddleware, buyTicket);

/**
 * GET /my
 * Retrieves a list of all tickets owned by the currently authenticated user.
 */
router.get("/my", authMiddleware, getMyTickets);

export default router;
