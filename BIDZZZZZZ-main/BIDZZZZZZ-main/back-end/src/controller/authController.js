import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { registerSchema, loginSchema } from "./Validation/authValidation.js";
import { ensureWalletForUser } from "./walletController.js";

const getJwtSecret = () => process.env.JWT_SECRET || "dev-secret-key";
const isDev = process.env.NODE_ENV !== "production";

export const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { fullName, email, password, phone } = value;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashedPassword, phone });
    await ensureWalletForUser(user._id);

    const token = jwt.sign({ id: user._id }, getJwtSecret(), { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("[register error]", err.message);
    res.status(500).json({ message: "Server error.", ...(isDev && { detail: err.message }) });
  }
};

export const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = value;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password." });

    // Unlock expired lock
    if (user.lockUntil && user.lockUntil < Date.now()) {
      user.loginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    // ⚠️ TESTING: account lock check disabled — re-enable before production
    // if (user.lockUntil && user.lockUntil > Date.now()) {
    //   return res.status(403).json({ message: "Account is locked. Try again later." });
    // }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // ⚠️ TESTING: brute force counter disabled — re-enable before production
      // user.loginAttempts += 1;
      // if (user.loginAttempts >= 3) user.lockUntil = Date.now() + 30 * 60 * 1000;
      // await user.save();
      return res.status(401).json({ message: "Invalid email or password." });
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();
    await ensureWalletForUser(user._id);

    const token = jwt.sign({ id: user._id }, getJwtSecret(), { expiresIn: "7d" });

    res.status(200).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("[login error]", err.message);
    res.status(500).json({ message: "Server error.", ...(isDev && { detail: err.message }) });
  }
};
