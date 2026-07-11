import mongoose from "mongoose";

const auctionEmbeddingSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number], // vector array
      required: true,
    },
  },
  { timestamps: true }
);

const AuctionEmbedding = mongoose.model(
  "AuctionEmbedding",
  auctionEmbeddingSchema
);

export default AuctionEmbedding;