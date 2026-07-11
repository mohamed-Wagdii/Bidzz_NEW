import mongoose from "mongoose";
import User from "./User.js";

const bidSchema = new mongoose.Schema({
    auction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auction"
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Bid", bidSchema);