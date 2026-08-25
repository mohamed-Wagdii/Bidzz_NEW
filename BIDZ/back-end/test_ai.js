import "dotenv/config";
import mongoose from "mongoose";
import { askAuctionAI } from "./src/AI/ragService.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bidzone";

async function testAI() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    console.log("\n--- Test 1: General Stats ---");
    const res1 = await askAuctionAI("How many active auctions are running right now?", null);
    console.log("AI Response:", res1.answer);

    console.log("\n--- Test 2: Unauthenticated Wallet Check ---");
    const res2 = await askAuctionAI("What is my wallet balance?", null);
    console.log("AI Response:", res2.answer);

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

testAI();
