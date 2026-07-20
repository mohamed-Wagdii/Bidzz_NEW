import AuctionEmbedding from "../models/AuctionEmbedding.js";
import { createEmbedding } from "./embed.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const chatModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});


// ===============================
// 2️⃣ COSINE SIMILARITY FUNCTION
// (دي اللي بتقارن بين embeddings)
// ===============================
function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  // Guard against zero-magnitude vectors to prevent NaN from division by zero
  if (magA === 0 || magB === 0) return 0;

  return dot / (magA * magB);
}


// ===============================
// 3️⃣ SEARCH SIMILAR AUCTIONS
// (هنا بنجيب أقرب داتا للسؤال)
// ===============================
async function searchSimilarAuctions(userQuery, topK = 3) {
  // createEmbedding uses RETRIEVAL_QUERY taskType — see embed.js
  const queryEmbedding = await createEmbedding(userQuery);
  const allDocs = await AuctionEmbedding.find();
  if (!allDocs.length) return [];

  const scored = allDocs.map((doc) => ({
    auctionId: doc.auctionId,
    text: doc.text,
    score: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}


// ===============================
// 4️⃣ GENERATE ANSWER باستخدام Gemini
// (بعد ما نجيب الداتا المناسبة)
// ===============================
async function generateAnswer(userQuery, contextDocs) {
  const contextText = contextDocs.map((doc) => doc.text).join("\n\n---\n\n");

  const prompt = `You are an AI assistant for BidZone, an online auction platform.
Use ONLY the context below to answer the user's question.
If the context doesn't contain enough info, say so honestly.

Context:
${contextText}

User Question: ${userQuery}

Answer:`;

  const result = await chatModel.generateContent(prompt);
  return result.response.text();
}


// ===============================
// 5️⃣ MAIN RAG FUNCTION
// (دي اللي هتستخدمها في الـ API)
// ===============================
export async function askAuctionAI(userQuery) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const relevantDocs = await searchSimilarAuctions(userQuery);

  if (!relevantDocs || relevantDocs.length === 0) {
    const result = await chatModel.generateContent(
      `You are a helpful assistant for BidZone, an online auction platform. Answer helpfully:\n\n${userQuery}`
    );
    return { answer: result.response.text(), sources: [] };
  }

  const answer = await generateAnswer(userQuery, relevantDocs);
  return { answer, sources: relevantDocs };
}