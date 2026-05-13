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
    },
    status:{
        type: String,
        enum:["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    amount: {
        type: Number,
        default: 0,
    },
    paymentStatus: {
        type: String,
        enum: ["unpaid", "pending", "paid", "failed", "refunded"],
        default: "unpaid",
    },
    paymentProvider: {
        type: String,
        enum: ["mtn", "airtel", null],
        default: null,
    },
    paymentReference: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
