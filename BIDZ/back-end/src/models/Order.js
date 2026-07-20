import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
      unique: true
    },

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    finalPrice: {
      type: Number,
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },

    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },

    shippingAddress: {
      type: String
    },
    shippingDetails: {
      fullName: String,
      phone: String,
      country: String,
      city: String,
      address: String,
      notes: String,
    },
    qrCode: {
      type: String,
      default: null,
    },
    qrVerified: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,
    shippedAt: Date,
    deliveredAt: Date
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;