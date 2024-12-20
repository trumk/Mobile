const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    class: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Class', 
        required: true 
    },
    yogaCourse: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'YogaCourse', 
        required: true 
    }
});

const CartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [CartItemSchema],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Cart', CartSchema);