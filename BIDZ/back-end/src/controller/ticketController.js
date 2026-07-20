import Ticket from "../models/Ticket.js";

export const buyTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      user: req.user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return res.status(201).json({ message: "Ticket purchased", ticket });
  } catch (error) {
    return res.status(500).json({ message: "error", error: error.message });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ tickets });
  } catch (error) {
    return res.status(500).json({ message: "error", error: error.message });
  }
};
