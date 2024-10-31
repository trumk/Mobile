const mongoose = require('mongoose');

const ClassTypeSchema = new mongoose.Schema({
    className: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: false 
    },
    teacher: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    duration: { 
        type: Number, 
        required: true 
    },
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: []
    }]
});

module.exports = mongoose.model('Class', ClassTypeSchema);