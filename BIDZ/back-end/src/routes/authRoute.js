import express from "express";
import { register, login, getProfile } from "../controller/authController.js";
import { requestPasswordReset, resetPassword } from "../controller/passwordResetController.js";
import { googleLogin } from "../controller/googleAuthController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

/**
 * POST /register
 * Registers a new user account.
 */
router.post("/register", register);

/**
 * POST /login
 * Authenticates a user and returns a token.
 */
router.post("/login", login);

/**
 * POST /google
 * Authenticates a user via Google OAuth.
 */
router.post("/google", googleLogin);

/**
 * POST /forgot-password
 * Initiates the password reset process by sending a reset link to the user's email.
 */
router.post("/forgot-password", requestPasswordReset);

/**
 * POST /reset-password
 * Resets the user's password using a valid reset token.
 */
router.post("/reset-password", resetPassword);

// GET /api/auth/profile
/**
 * GET /profile
 * Retrieves the currently authenticated user's profile information.
 */
router.get("/profile", authMiddleware, getProfile);

export default router;
