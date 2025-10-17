import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, 'Hostel name is required'],
        maxlength: [50, 'Hostel name can not be more than 100 characters ']
    },
    images: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        required: true,

    },
    availableRooms: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        maxlength: 1000
    }, 
    rules: {
        type: String,
        maxlength: 400
    },
    amenities: {
        type: [String],
        enum: ['hostel shuttle', 'wifi', 'security','parking', 'library']
    },
    genderPolicy: {
        type: String,
        enum: ['male', 'female', 'mixed'],
        default : 'mixed'
    },
    priceRange: {
        min: Number,
        max: Number,
    },
    contactInfo: {
        type: String,
    },
    
})

const Hostel = mongoose.model('Hostel', hostelSchema);
export default Hostel;