import express from "express";
import { askAuctionAI } from "../AI/ragService.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/ask", authMiddleware, async (req, res) => {
  try {
    const { question } = req.body;

    // validation بسيطة
    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    // نكلم الـ RAG system
    const result = await askAuctionAI(question);

    return res.status(200).json({
      success: true,
      answer: result.answer,
      sources: result.sources,
    });
  } catch (error) {
    console.error("AI Route Error:", error.message);

    const isConfig = error.message?.includes("GEMINI_API_KEY");
    return res.status(isConfig ? 503 : 500).json({
      success: false,
      message: isConfig
        ? "AI service is not configured. Please set GEMINI_API_KEY in .env"
        : "AI service failed. Please try again.",
    });
  }
});

export default router;