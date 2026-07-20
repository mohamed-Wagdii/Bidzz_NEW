import AuctionEmbedding from "../models/AuctionEmbedding.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildAuctionDocument } from "./buildDocument.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

// Use RETRIEVAL_DOCUMENT for ingestion — pairs with RETRIEVAL_QUERY on the search side
async function createDocEmbedding(text) {
  const result = await embeddingModel.embedContent({
    content: { parts: [{ text }], role: "user" },
    taskType: "RETRIEVAL_DOCUMENT",
  });
  return result.embedding.values;
}

export async function ingestAuction(auction, product, seller) {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") return;

    await AuctionEmbedding.deleteOne({ auctionId: auction._id });
    const doc = buildAuctionDocument(auction, product, seller);
    const embedding = await createDocEmbedding(doc);

    await AuctionEmbedding.create({ auctionId: auction._id, text: doc, embedding });
    console.log(`Ingested auction: ${auction._id}`);
  } catch (error) {
    console.error("Ingest error:", error.message);
  }
}
