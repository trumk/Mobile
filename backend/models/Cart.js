const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    classType: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ClassType', 
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
