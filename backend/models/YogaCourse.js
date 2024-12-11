const mongoose = require('mongoose');

const YogaCourseSchema = new mongoose.Schema({
    dayOfWeek: { 
        type: [String], 
        required: true 
    },
    timeOfCourse: {
        type: String,
        required: true,
    },
    capacity: { 
        type: Number, 
        required: true 
    },
    pricePerClass: { 
        type: Number, 
        required: true 
    },
    typeOfClass: { 
        type: String, 
        required: true 
    },
    class: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Class', 
        required: true 
    }],
    location: { 
        type: String, 
        required: true 
    },
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: [] 
    }]
});

module.exports = mongoose.model('YogaCourse', YogaCourseSchema);