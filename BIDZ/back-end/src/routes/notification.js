import express from "express";
import { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead } from "../controller/notification.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

/**
 * GET /
 * Retrieves all notifications for the currently authenticated user.
 */
router.get("/", getMyNotifications);

/**
 * GET /unread-count
 * Returns the total count of unread notifications for the user.
 */
router.get("/unread-count", getUnreadCount);

/**
 * PATCH /read-all
 * Marks all of the user's unread notifications as read.
 */
router.patch("/read-all", markAllAsRead);

/**
 * PATCH /:id/read
 * Marks a specific notification as read by its ID.
 */
router.patch("/:id/read", markAsRead);

export default router;
