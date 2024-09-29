const mongoose = require('mongoose');

const HikeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    parkingAvailable: { type: String, required: true },
    length: { type: Number, required: true },
    difficulty: { type: String, required: true },
    description: { type: String },
    weather: { type: String },
    companion: { type: String },
    observations: [
        {
            observation: { type: String, required: true },
            time: { type: Date, default: Date.now },
            comments: { type: String }
        }
    ]
});

module.exports = mongoose.model('Hike', HikeSchema);
