import Booking from "../models/bookingModel.js";
import Room from "../models/roomModel.js";

export const createBooking = async (req, res) => {
  try {
    const { username, email, phonenumber, checkInDate, room } = req.body;

    if (!username || !email || !phonenumber || !checkInDate || !room) {
      return res.status(400).json({ message: "Missing required booking fields" });
    }

    // verify room exists
    const existingRoom = await Room.findById(room);
    if (!existingRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    const booking = new Booking({
      username,
      email,
      phonenumber,
      checkInDate: new Date(checkInDate),
      room,
      // bookedby can be set later when auth is integrated (req.user?._id)
    });

    await booking.save();
    await booking.populate({ path: "room", populate: { path: "hostel" } });
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create booking", error: error.message });
  }
};

// get all bookings with room (and nested hostel) info
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({ path: "room", populate: { path: "hostel" } })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};