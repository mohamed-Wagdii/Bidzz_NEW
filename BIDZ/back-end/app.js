import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import http from "http";
// ⚠️ hpp + xss-clean removed — not compatible with Express v5

import logger, { accessLogStream } from "./src/Config/logger.js";
import { initSocket } from "./src/Config/Socjet.js";
import { apiLimiter } from "./src/middleware/rateLimit.js";

import emailRoutes from "./src/routes/emailRoutes.js";
import authRoute from "./src/routes/authRoute.js";
import uploadImage from "./src/routes/uplaodImage.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import productRoutes from "./src/routes/productRoute.js";
import ticketRoute from "./src/routes/ticketRoute.js";
import auctionRoute from "./src/routes/auctionRoute.js";
import orderRoute from "./src/routes/orderRoute.js";
import bidRoute from "./src/routes/bidRoute.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import notificationRoute from "./src/routes/notification.js";
import walletRoute from "./src/routes/walletRoute.js";
import reportRoute from "./src/routes/reportRoute.js";
import adminRoute from "./src/routes/adminRoute.js";

const app = express();
const server = http.createServer(app);

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));

// ── HTTP request logging ──────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", { stream: accessLogStream }));

// ── Raw body for Stripe webhooks (must come BEFORE express.json) ──────────────
app.use("/api/orders/stripe/webhook", express.raw({ type: "application/json" }), (req, _res, next) => {
  req.rawBody = req.body;
  next();
});

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── Data sanitization ─────────────────────────────────────────────────────────
// express-mongo-sanitize is not compatible with Express v5 — manual sanitize instead
app.use((req, _res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === "object") {
      for (const key of Object.keys(obj)) {
        if (key.startsWith("$") || key.includes(".")) { delete obj[key]; }
        else sanitize(obj[key]);
      }
    }
  };
  sanitize(req.body);
  sanitize(req.params);
  next();
});

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use(apiLimiter);

// ── Socket.IO ─────────────────────────────────────────────────────────────────
initSocket(server);

// ── Static files ──────────────────────────────────────────────────────────────
app.use("/images", express.static("src/images"));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoute);
app.use("/api/email", emailRoutes);
app.use("/api/upload", uploadImage);
app.use("/api/chat", chatRoutes);
app.use("/api/products", productRoutes);
app.use("/api/tickets", ticketRoute);
app.use("/api/auctions", auctionRoute);
app.use("/api/orders", orderRoute);
app.use("/api/bids", bidRoute);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoute);
app.use("/api/wallet", walletRoute);
app.use("/api/reports", reportRoute);
app.use("/api/admin", adminRoute);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error("Unhandled error", { error: err.message, stack: err.stack, path: req.path });
  res.status(err.status || 500).json({ message: err.message || "Internal server error." });
});

// ── Unhandled rejections ──────────────────────────────────────────────────────
process.on("unhandledRejection", (reason) => logger.error("Unhandled Rejection", { reason }));
process.on("uncaughtException", (err) => { logger.error("Uncaught Exception", { error: err.message }); process.exit(1); });

// ── DB + Server ───────────────────────────────────────────────────────────────
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bidzone";

mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => {
    logger.warn("DB connection failed — continuing for local dev", { error: err.message });
  });

const basePort = Number(process.env.PORT || 5000);

const tryListen = (port) => {
  server.removeAllListeners("error");
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE" && port - basePort <= 10) {
      logger.warn(`Port ${port} in use, trying ${port + 1}`);
      tryListen(port + 1);
    } else {
      logger.error("Server failed to start", { error: err.message });
      process.exit(1);
    }
  });
  server.listen(port, () => logger.info(`Server running on http://localhost:${port}`));
};

tryListen(basePort);
