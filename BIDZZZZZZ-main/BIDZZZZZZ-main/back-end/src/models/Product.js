import mongoose from "mongoose";
import User from "./User.js";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: [String],
        required: true,
        validate: {
            validator: arr => Array.isArray(arr) && arr.length > 0,
            message: "Product image is required."
        }
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    ////////////////// status should be pending but i will change to test it 
   status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved"
  }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
