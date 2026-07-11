import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetType: {
      type: String,
      enum: ["seller", "buyer", "auction", "message", "order", "product"],
      required: true,
    },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reason: {
      type: String,
      enum: ["spam", "fraud", "fake_product", "abusive_language", "scam", "other"],
      required: true,
    },
    description: { type: String, maxlength: 1000, default: "" },
    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
    },
    adminNote: { type: String, default: "" },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    resolvedAt: { type: Date, default: null },
    action: {
      type: String,
      enum: ["none", "warn", "suspend", "ban", "delete_auction", "delete_product", "dismiss"],
      default: "none",
    },
  },
  { timestamps: true }
);

reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ reporter: 1 });
reportSchema.index({ targetId: 1, targetType: 1 });

export default mongoose.model("Report", reportSchema);
