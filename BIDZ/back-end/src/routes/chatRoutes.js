import express from "express";
import {
  canChat,
  findOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  sendTyping,
} from "../controller/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /can-chat
 * Checks if the user is authorized to initiate a chat based on current active orders or bids.
 */
router.get("/can-chat",                        authMiddleware, canChat);

/**
 * POST /conversation
 * Finds an existing conversation between users or creates a new one if it doesn't exist.
 */
router.post("/conversation",                   authMiddleware, findOrCreateConversation);

/**
 * GET /conversations
 * Retrieves all conversations involving the currently authenticated user.
 */
router.get("/conversations",                   authMiddleware, getConversations);

/**
 * GET /:conversationId/messages
 * Retrieves all messages for a specific conversation by ID.
 */
router.get("/:conversationId/messages",        authMiddleware, getMessages);

/**
 * POST /send
 * Sends a new message in a conversation.
 */
router.post("/send",                           authMiddleware, sendMessage);

/**
 * POST /:conversationId/typing
 * Emits a typing indicator event to other users in the specified conversation.
 */
router.post("/:conversationId/typing",         authMiddleware, sendTyping);

export default router;
