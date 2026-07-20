import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ensureWalletForUser } from "./walletController.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: "Google credential is required" });

    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(400).json({ message: "Google account email is required" });

    let user = await User.findOne({ email: payload.email.toLowerCase() });

    if (!user) {
      user = await User.create({
        fullName: payload.name || "Google User",
        email: payload.email.toLowerCase(),
        password: Math.random().toString(36).slice(-10),
        phone: "",
        role: "buyer",
      });
    }

    await ensureWalletForUser(user._id);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "dev-secret-key", { expiresIn: "7d" });
    res.status(200).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
