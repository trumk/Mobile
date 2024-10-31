const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        minlength: [3, 'Username must be at least 3 characters long'],
        match: [/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers, no spaces or special characters'] 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/\S+@\S+\.\S+/, 'Invalid email format'] 
    },
    password: { 
        type: String, 
        required: true, 
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: { 
        type: String, 
        enum: ['admin', 'customer'], 
        default: 'customer' 
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'YogaCourse' }],
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
},{ timestamps: true });

module.exports = mongoose.model('User', userSchema);