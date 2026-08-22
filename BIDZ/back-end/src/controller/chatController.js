import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import Auction from "../models/Auctions.js";
import User from "../models/User.js";
import { getIO } from "../Config/Socjet.js";
import { createAndEmitNotification } from "./notification.js";

import { verifyAuctionAccess } from "../Services/auctionService.js";

// ── helpers ───────────────────────────────────────────────────────────────────

/**
 * Has Bid Access
 * Helper wrapper around the shared verifyAuctionAccess service.
 */
const hasBidAccess = async (userId, auctionId) => {
  const result = await verifyAuctionAccess(userId, auctionId);
  return result.hasAccess;
};

/**
 * Can Chat
 * Endpoint to check if the current user has access to initiate a chat regarding a specific auction.
 */
export const canChat = async (req, res) => {
  try {
    const { auctionId } = req.query;
    if (!auctionId) return res.status(400).json({ canChat: false, message: "auctionId is required" });
    const allowed = await hasBidAccess(req.user._id, auctionId);
    res.json({ canChat: allowed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Find Or Create Conversation
 * Finds an existing conversation between the sender and receiver. If one doesn't exist,
 * it verifies their access and creates a new conversation, notifying the receiver.
 */
export const findOrCreateConversation = async (req, res) => {
  try {
    const { receiverId, auctionId } = req.body;
    const senderId = req.user._id;

    if (!receiverId) return res.status(400).json({ message: "receiverId is required" });
    if (senderId.toString() === receiverId.toString())
      return res.status(400).json({ message: "Cannot start a conversation with yourself" });

    // Verify receiver exists
    const receiver = await User.findById(receiverId).select("fullName");
    if (!receiver) return res.status(404).json({ message: "User not found" });

    // If auctionId provided, check access
    if (auctionId) {
      const allowed = await hasBidAccess(senderId, auctionId);
      if (!allowed) return res.status(403).json({ message: "You must place a bid before chatting with the seller" });
    }

    // Find existing conversation
    const query = {
      participants: { $all: [senderId, receiverId], $size: 2 },
    };
    if (auctionId) query.auctionId = auctionId;

    let conversation = await Conversation.findOne(query)
      .populate("participants", "fullName email")
      .populate({ path: "lastMessage", select: "message createdAt senderId isRead" })
      .populate("auctionId", "Product");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        auctionId: auctionId || null,
        unreadCounts: { [senderId.toString()]: 0, [receiverId.toString()]: 0 },
      });
      conversation = await Conversation.findById(conversation._id)
        .populate("participants", "fullName email")
        .populate("auctionId", "Product");

      // Notify receiver of new conversation
      createAndEmitNotification({
        receiver: receiverId,
        sender: senderId,
        type: "message",
        title: "New Conversation",
        message: `${req.user.fullName} started a conversation with you.`,
        relatedId: conversation._id,
      }).catch(() => {});

      // Emit socket event to receiver
      const io = getIO();
      if (io) io.to(receiverId.toString()).emit("new_conversation", conversation);
    }

    res.json({ conversation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get Conversations
 * Retrieves all conversations involving the authenticated user, including the last message
 * and unread counts, sorted by the most recently updated.
 */
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "fullName email")
      .populate({ path: "lastMessage", select: "message createdAt senderId isRead" })
      .populate({ path: "auctionId", populate: { path: "Product", select: "name image" } })
      .sort({ updatedAt: -1 });

    const result = conversations.map(conv => {
      const other = conv.participants.find(p => p._id.toString() !== userId.toString());
      const myUnread = conv.unreadCounts?.get(userId.toString()) || 0;
      return {
        _id: conv._id,
        otherUser: other,
        auctionId: conv.auctionId?._id || null,
        auctionName: conv.auctionId?.Product?.name || null,
        auctionImage: conv.auctionId?.Product?.image?.[0] || null,
        lastMessage: conv.lastMessage?.message || null,
        lastMessageTime: conv.lastMessage?.createdAt || conv.createdAt,
        unreadCount: myUnread,
        updatedAt: conv.updatedAt,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get Messages
 * Retrieves all messages for a given conversation. Marks any unread messages as read
 * and notifies the other participant via WebSockets.
 */
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    const isParticipant = conversation.participants.some(p => p.toString() === userId.toString());
    if (!isParticipant) return res.status(403).json({ message: "Access denied" });

    const messages = await Message.find({ conversationId })
      .populate("senderId", "fullName")
      .sort({ createdAt: 1 });

    // Mark all unread messages as read
    await Message.updateMany(
      { conversationId, receiverId: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    // Reset unread count for this user
    conversation.unreadCounts.set(userId.toString(), 0);
    await conversation.save();

    // Emit read receipts to the other participant
    const io = getIO();
    if (io) {
      const other = conversation.participants.find(p => p.toString() !== userId.toString());
      if (other) {
        io.to(other.toString()).emit("messages_read", { conversationId, readBy: userId });
      }
    }

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Send Message
 * Sends a new message in a conversation. Creates the conversation if it doesn't already exist.
 * Emits the new message to both participants via WebSockets and sends a notification.
 */
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, message, auctionId } = req.body;
    const senderId = req.user._id;

    if (!message?.trim()) return res.status(400).json({ message: "Message cannot be empty" });

    let convId = conversationId;

    // If no conversationId, find or create one
    if (!convId) {
      if (!receiverId) return res.status(400).json({ message: "conversationId or receiverId is required" });

      const query = { participants: { $all: [senderId, receiverId], $size: 2 } };
      if (auctionId) query.auctionId = auctionId;

      let conv = await Conversation.findOne(query);
      if (!conv) {
        conv = await Conversation.create({
          participants: [senderId, receiverId],
          auctionId: auctionId || null,
          unreadCounts: { [senderId.toString()]: 0, [receiverId.toString()]: 0 },
        });
      }
      convId = conv._id;
    }

    const conversation = await Conversation.findById(convId);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    const isParticipant = conversation.participants.some(p => p.toString() === senderId.toString());
    if (!isParticipant) return res.status(403).json({ message: "Not a participant" });

    const receiver = conversation.participants.find(p => p.toString() !== senderId.toString());

    // Create message
    const newMessage = await Message.create({
      conversationId: convId,
      senderId,
      receiverId: receiver,
      auctionId: conversation.auctionId || null,
      message: message.trim(),
      isRead: false,
    });

    // Update conversation lastMessage + unread count for receiver
    const receiverUnread = (conversation.unreadCounts?.get(receiver.toString()) || 0) + 1;
    conversation.lastMessage = newMessage._id;
    conversation.unreadCounts.set(receiver.toString(), receiverUnread);
    await conversation.save();

    const populated = await Message.findById(newMessage._id).populate("senderId", "fullName");

    // Emit to both participants
    const io = getIO();
    if (io) {
      io.to(senderId.toString()).emit("receive_message", { message: populated, conversationId: convId });
      io.to(receiver.toString()).emit("receive_message", { message: populated, conversationId: convId });
      // Update conversation list for receiver
      io.to(receiver.toString()).emit("conversation_updated", {
        conversationId: convId,
        lastMessage: message.trim(),
        unreadCount: receiverUnread,
      });
    }

    // Notify receiver
    createAndEmitNotification({
      receiver,
      sender: senderId,
      type: "message",
      title: "New Message",
      message: `${req.user.fullName}: ${message.trim().slice(0, 60)}`,
      relatedId: convId,
    }).catch(() => {});

    res.status(201).json({ message: populated, conversationId: convId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Send Typing
 * Emits a typing indicator via WebSockets to the other participant in the conversation.
 */
export const sendTyping = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { isTyping } = req.body;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: "Not found" });

    const other = conversation.participants.find(p => p.toString() !== userId.toString());
    if (other) {
      const io = getIO();
      if (io) io.to(other.toString()).emit("typing", { conversationId, userId, isTyping });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
