import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import config from "./config/database.js";

import bookingRoutes from "./routes/bookingRoutes.js";
import hostelRoutes from "./routes/hostelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import authRoutes from "./routes/auth.js";

import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve images from /media
app.use('/media', express.static(path.join(__dirname, 'media')));

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
async function connectDB() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(config.database);
    console.log("Connected to Database");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1); // stop server if DB fails
  }
}
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/rooms", roomRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


const PORT = process.env.PORT || 3100;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

