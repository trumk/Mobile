const mongoose = require('mongoose');

const YogaCourseSchema = new mongoose.Schema({
    dayOfWeek: { 
        type: String, 
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
    classType: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ClassType', 
        required: true 
    }],
    location: { 
        type: String, 
        required: true 
    },
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]
});

module.exports = mongoose.model('YogaCourse', YogaCourseSchema);
