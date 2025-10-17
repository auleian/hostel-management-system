import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    
    checkInDate: {
        type: Date,
        required: true
    },

    checkOutDate: {
        type: Date,
    },

    bookedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // Made optional to allow guest bookings until auth is integrated
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
