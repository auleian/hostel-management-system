import Booking from "../models/bookingModel.js";

export const createBooking = async(req, res) =>{
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).json({message: 'Booking created successfully', booking})
    } catch (error) {
        res.status(400).json({message:'Failed to create booking', error: error.message})
    }
}

// get all bookings with hostel info
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("hostel"); // 🔥 joins hostel details
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}