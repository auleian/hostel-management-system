import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import config from "./config/database.js";

import bookingRoutes from "./Routes/bookingRoutes.js";
import hostelRoutes from "./Routes/hostels.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(config.database);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // stop server if DB fails
  }
}
connectDB();

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/hostels", hostelRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
