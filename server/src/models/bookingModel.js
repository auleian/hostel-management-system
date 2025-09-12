import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phonenumber: {
        type: String,
        required: true,
        unique: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
   
    roomType: {
        type: String,
        required: true
    }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
