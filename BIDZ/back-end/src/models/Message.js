import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
    senderId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    auctionId:      { type: mongoose.Schema.Types.ObjectId, ref: "Auction", default: null },
    message:        { type: String, default: "" },
    attachments:    [{ url: String, type: String }], // future-ready
    isRead:         { type: Boolean, default: false },
    readAt:         { type: Date, default: null },
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
