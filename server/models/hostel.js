const mongoose = 'mongoose'

const hostelSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, 'Hostel name is required'],
        maxlength: [50, 'Hostel name can not be more than 100 characters ']
    },
    location: {
        type: String,
        required: [true, 'Hostel location is required'],

    },
    description: {
        type: String,
        maxlength: [1000, 'Description can not exceed 1000 characters ']
    }, 
    rules: {
        type: String,
        maxlength: [400, 'Hostel rules can not be more than 400 characters ']
    },
    amenities: {
        type: String,
        enum: ['hostel shuttle', 'wifi', 'security','parking', 'library']
    },
    
    
})