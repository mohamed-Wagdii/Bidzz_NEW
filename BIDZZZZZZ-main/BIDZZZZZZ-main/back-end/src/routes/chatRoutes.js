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

router.get("/can-chat",                        authMiddleware, canChat);
router.post("/conversation",                   authMiddleware, findOrCreateConversation);
router.get("/conversations",                   authMiddleware, getConversations);
router.get("/:conversationId/messages",        authMiddleware, getMessages);
router.post("/send",                           authMiddleware, sendMessage);
router.post("/:conversationId/typing",         authMiddleware, sendTyping);

export default router;
