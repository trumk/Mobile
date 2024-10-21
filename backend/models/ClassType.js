const mongoose = require('mongoose');

const ClassTypeSchema = new mongoose.Schema({
    typeName: { 
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
    }
});

module.exports = mongoose.model('ClassType', ClassTypeSchema);
