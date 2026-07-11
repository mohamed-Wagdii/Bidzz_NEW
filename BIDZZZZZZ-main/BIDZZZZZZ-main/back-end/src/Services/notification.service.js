import Notification from "../models/Notification.js";

export const createNotification = async ({
  receiver,
  sender = null,
  type,
  title,
  message,
  relatedId = null,
}) => {
  try {
    const notification = await Notification.create({
      receiver,
      sender,
      type,
      title,
      message,
      relatedId,
    });

    return notification;
  } catch (error) {
    throw error;
  }
};