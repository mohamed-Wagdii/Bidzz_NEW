import mongoose from "mongoose";
import User from "./User.js";

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  price: {
    type: Number,
    
  },

  expiresAt: {
    type: Date,
    required: true
  },

  used: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);