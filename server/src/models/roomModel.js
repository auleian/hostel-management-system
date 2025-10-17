import mongoose from 'mongoose';


const roomSchema = new mongoose.Schema ({
    roomNumber: {
        type: String,
        required: [true, 'Room number is required'],
        maxlength: [10, 'Room number can not be more than 10 characters ']
    },
    roomType: {
        type: String,
        enum: ['single', 'double', 'suite'],
        required: [true, 'Room type is required']
    },
    moreInfo: {
        type: String,
        maxlength: 500
    },
    price: {
        type: Number,
        required: [true, 'Room price is required']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: [true, 'Hostel is required']
    },
    isSelfContained: {
        type: Boolean,
        default: false
    },
    amenities: {
        type: [String],
        enum: ['wifi', 'air conditioning', 'heating', 'tv', 'mini fridge']
    },
    images: {
        type: [String],
        required: [true, 'Room images are required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
