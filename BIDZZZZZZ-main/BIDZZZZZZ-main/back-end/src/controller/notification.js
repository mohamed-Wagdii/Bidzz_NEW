import Notification from "../models/Notification.js";
import { getIO } from "../Config/Socjet.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ receiver: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ receiver: req.user._id, isRead: false });
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, receiver: req.user._id },
      { isRead: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ receiver: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAndEmitNotification = async ({ receiver, sender = null, type, title, message, relatedId = null }) => {
  try {
    const notification = await Notification.create({ receiver, sender, type, title, message, relatedId });
    const io = getIO();
    if (io) {
      io.to(receiver.toString()).emit("new_notification", notification);
    }
    return notification;
  } catch (error) {
    console.error("Notification error:", error.message);
  }
};
