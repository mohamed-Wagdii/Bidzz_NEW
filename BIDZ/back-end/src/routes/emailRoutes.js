import express from "express";
import sendEmail from "../sendEmail/sendEmail.js";

const router = express.Router();

// POST /api/email/send
/**
 * POST /send
 * API endpoint to send a generic email. Expects recipient email (to), subject, and plain text content in the body.
 */
router.post("/send", async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    const result = await sendEmail(to, subject, text);

    res.json({
      message: "Email sent successfully",
      to,
      messageId: result.messageId,
    });
  } catch (error) {
    console.log("EMAIL ROUTE ERROR:", error);

    res.status(500).json({
      message: "Failed to send email",
      error: error.message,
    });
  }
});

export default router;