import mongoose from "mongoose";
import User from "./User.js";
import Product from "./Product.js";
const auctionSchema = new mongoose.Schema({
    Product:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    startTime:{
        type:Date,
        required:true

},
participants: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],
endTime:{
    type:Date,
    required:true
},
startingPrice:{
    type:Number,
    required:true,
    default:0
},
highestBider:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
},
 status: {
    type: String,
    enum: ["pending", "active", "ended"],
    default: "pending"
  }
}, { timestamps: true });

const Auction = mongoose.model("Auction", auctionSchema);

export default Auction;
