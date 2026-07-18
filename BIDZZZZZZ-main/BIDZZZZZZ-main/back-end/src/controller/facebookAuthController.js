import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ensureWalletForUser } from "./walletController.js";

export const facebookLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ message: "Facebook accessToken is required" });
    }

    // Verify token with Facebook Graph API
    const fbRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
    const fbData = await fbRes.json();

    if (fbData.error) {
      return res.status(400).json({ message: "Invalid Facebook token", details: fbData.error });
    }
    
    if (!fbData.email) {
      return res.status(400).json({ message: "Facebook account email is required. Please ensure email permission is granted." });
    }

    let user = await User.findOne({ email: fbData.email.toLowerCase() });

    if (!user) {
      user = await User.create({
        fullName: fbData.name || "Facebook User",
        email: fbData.email.toLowerCase(),
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
