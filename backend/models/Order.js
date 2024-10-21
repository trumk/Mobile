const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    classType: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ClassType', 
        required: true 
    },
    pricePerClass: { 
        type: Number, 
        required: true 
    }
});

const OrderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [OrderItemSchema],
    totalAmount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Completed', 'Cancelled'], 
        default: 'Pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Order', OrderSchema);