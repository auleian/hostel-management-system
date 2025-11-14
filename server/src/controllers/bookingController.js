import Booking from "../models/bookingModel.js";
import Room from "../models/roomModel.js";
import { logger } from "../middleware/logger.js";

export const createBooking = async (req, res) => {
  try {
    const { checkInDate, room } = req.body;

    if (!checkInDate || !room) {
      return res.status(400).json({ message: "Missing required booking fields" });
    }

    // verify room exists
    const existingRoom = await Room.findById(room);
    if (!existingRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Debug: log req.user to see what the protect middleware set
    //console.log("req.user:", req.user);

    const booking = new Booking({
      checkInDate: new Date(checkInDate),
      room,
      status: "pending",
      bookedby: req.user?.id
    });

    await booking.save();
    await booking.populate({ path: "room", populate: { path: "hostel" } });
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    logger.error("Failed to create booking:", error);
    res
      .status(400)
      .json({ message: "Failed to create booking", error: error.message });
  }
};

// get all bookings with room (and nested hostel) info
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("bookedby")
      .populate({ path: "room", populate: { path: "hostel" } })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    logger.error("Failed to get all bookings:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking status updated", booking });
  } catch (error) {
    logger.error("Failed to update booking status:", error);
    res.status(500).json({ message: error.message });
  }
};
