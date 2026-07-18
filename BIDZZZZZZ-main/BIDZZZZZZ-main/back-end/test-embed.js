import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key_just_to_init");
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function run() {
  try {
    console.log("Trying embedContent with RETRIEVAL_DOCUMENT...");
    const result = await embeddingModel.embedContent({
      content: { parts: [{ text: "Hello document" }], role: "user" },
      taskType: "RETRIEVAL_DOCUMENT",
    });
    console.log("SUCCESS length:", result.embedding.values.length);
  } catch (err) {
    console.error("ERROR 1:", err.message);
  }
}

run();
