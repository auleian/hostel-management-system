import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/database.js";
import { protect } from "./middleware/auth.js";
import { logger } from "./middleware/logger.js";

import authRoutes from "./Routes/auth.js";
import bookingRoutes from "./Routes/bookingRoutes.js";
import hostelRoutes from "./Routes/hostelRoutes.js";
import roomRoutes from "./Routes/roomRoutes.js";
import paymentRoutes from "./Routes/paymentRoutes.js";

import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Disable ETag responses for API endpoints so authenticated JSON endpoints
// always return a full JSON body instead of 304 Not Modified when the
// client includes If-None-Match. This avoids accidental empty responses
// for protected API routes during development.
app.set('etag', false);

// Serve images from /media
app.use('/media', express.static(path.join(__dirname, 'media')));

// Middleware
app.use(cors({ origin: "*" }));
app.use(cookieParser());
// Capture raw body for webhook signature verification
app.use(express.json({
  verify: (req, _res, buf) => {
    if (req.originalUrl?.startsWith("/api/payments/webhooks")) {
      req.rawBody = buf.toString("utf8");
    }
  },
}));
app.use(express.urlencoded({ extended: true }));

// Database connection
async function connectDB() {
  try {
    logger.info("Connecting to Database...");
    await mongoose.connect(config.database);
    logger.info("Connected to Database");
  } catch (error) {
    logger.error("Database connection error:", error.message);
    process.exit(1); // stop server if DB fails
  }
}
connectDB();

// Health check (used to keep Render warm + monitor uptime)
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptimeSeconds: Math.round(process.uptime()),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", protect, bookingRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/payments", paymentRoutes);



// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


const PORT = process.env.PORT || 3100;


app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

