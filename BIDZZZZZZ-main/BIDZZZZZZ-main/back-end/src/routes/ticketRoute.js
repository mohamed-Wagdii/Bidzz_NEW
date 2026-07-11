import express from "express";
import { buyTicket, getMyTickets } from "../controller/ticketController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/buy", authMiddleware, buyTicket);
router.get("/my", authMiddleware, getMyTickets);

export default router;
