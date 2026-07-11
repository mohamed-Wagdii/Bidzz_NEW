import { Server } from "socket.io";
import Auction from "../models/Auctions.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // =========================
    // 0) JOIN USER (for chat)
    // =========================
    socket.on("join", (userId) => {
      if (!userId) return;
      socket.join(userId.toString());
      console.log(`User ${userId} joined their room`);
    });

    // =========================
    // 1) USER ROOM (notifications)
    // =========================
    socket.on("joinUserRoom", (userId) => {
      socket.join(`user:${userId}`);
      console.log(`User room joined: user:${userId}`);
    });

    // =========================
    // 2) AUCTION ROOM
    // =========================
    socket.on("joinAuction", async ({ auctionId, userId }) => {
      try {
        const auction = await Auction.findById(auctionId);

        if (!auction) {
          return socket.emit("error", "Auction not found");
        }

        // ✅ صاحب المزاد
        const isOwner =
          auction.seller.toString() === userId;

        // ✅ مشارك في المزاد
        const isParticipant = auction.participants?.some(
          (p) => p.toString() === userId
        );

        // 🚫 check permissions
        if (!isOwner && !isParticipant) {
          return socket.emit(
            "error",
            "Not allowed to join this auction"
          );
        }

        // join room
        socket.join(`auction:${auctionId}`);

        socket.emit("joinedAuction", {
          auctionId,
          status: "success",
        });

        // notify others in room
        socket.to(`auction:${auctionId}`).emit("notification", {
          type: "USER_JOINED",
          message: "Someone joined the auction room",
        });
      } catch (err) {
        console.log(err);
        socket.emit("error", "Server error");
      }
    });

    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export const getIO = () => io;