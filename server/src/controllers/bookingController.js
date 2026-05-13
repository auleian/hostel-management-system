import Booking from "../models/bookingModel.js";
import Room from "../models/roomModel.js";
import User from "../models/User.js";
import { logger } from "../middleware/logger.js";
import { NotificationService } from "../integrations/notifications/notificationService.js";
import { EVENTS } from "../integrations/lib/eventTypes.js";

export const createBooking = async (req, res) => {
  try {
    const { checkInDate, room } = req.body;

    if (!checkInDate || !room) {
      return res.status(400).json({ message: "Missing required booking fields" });
    }

    const existingRoom = await Room.findById(room).populate("hostel");
    if (!existingRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    const booking = new Booking({
      checkInDate: new Date(checkInDate),
      room,
      status: "pending",
      bookedby: req.user?.id,
      amount: existingRoom.price || 0,
      paymentStatus: "unpaid",
    });

    await booking.save();
    await booking.populate({ path: "room", populate: { path: "hostel" } });

    // Fire-and-forget notifications
    (async () => {
      try {
        const user = req.user?.id ? await User.findById(req.user.id).select("name email contact") : null;
        const hostel = booking.room?.hostel;
        const owner = hostel?.owner ? await User.findById(hostel.owner).select("name email contact") : null;
        await NotificationService.dispatch(EVENTS.BOOKING_CREATED, {
          user,
          booking: booking.toObject(),
          room: booking.room?.toObject?.() || booking.room,
          hostel: hostel?.toObject?.() || hostel,
        });
        if (owner) {
          await NotificationService.dispatch(EVENTS.NEW_BOOKING_FOR_OWNER, {
            owner,
            user,
            booking: booking.toObject(),
            room: booking.room?.toObject?.() || booking.room,
            hostel: hostel?.toObject?.() || hostel,
          });
        }
      } catch (e) {
        logger.error(`[booking] notification dispatch failed: ${e.message}`);
      }
    })();

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

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true })
      .populate({ path: "room", populate: { path: "hostel" } });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (status === "confirmed") {
      (async () => {
        try {
          const user = booking.bookedby ? await User.findById(booking.bookedby).select("name email contact") : null;
          await NotificationService.dispatch(EVENTS.BOOKING_CONFIRMED, {
            user,
            booking: booking.toObject(),
            room: booking.room?.toObject?.() || booking.room,
            hostel: booking.room?.hostel?.toObject?.() || booking.room?.hostel,
          });
        } catch (e) {
          logger.error(`[booking] confirm notification failed: ${e.message}`);
        }
      })();
    }

    res.json({ message: "Booking status updated", booking });
  } catch (error) {
    logger.error("Failed to update booking status:", error);
    res.status(500).json({ message: error.message });
  }
};
