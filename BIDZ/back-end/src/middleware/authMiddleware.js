import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Authentication Middleware
 * Intercepts incoming requests to verify the presence and validity of a JWT token.
 * Decodes the token, fetches the user from the database, and attaches it to `req.user`.
 * Rejects requests with invalid or missing tokens.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret-key");

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;