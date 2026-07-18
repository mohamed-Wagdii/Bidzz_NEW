import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
  console.warn("⚠️  GEMINI_API_KEY not set — AI features will be disabled.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Embedding model
const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

export async function createEmbedding(text) {
  try {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Gemini Embedding Error:", error.message);
    throw error;
  }
}