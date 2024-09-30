const Hike = require('../models/Hike');

// Get all hikes
exports.getAllHikes = async (req, res) => {
    try {
        const hikes = await Hike.find();
        res.json(hikes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new hike
exports.createHike = async (req, res) => {
    const { name, location, locationEnd, date, parkingAvailable, length, difficulty, description, weather} = req.body;
    try {
        const newHike = new Hike({
            name, location, locationEnd, date, parkingAvailable, length, difficulty, description, weather
        });
        await newHike.save();
        res.status(201).json(newHike);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update hike
exports.updateHike = async (req, res) => {
    try {
        const updatedHike = await Hike.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedHike);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete hike
exports.deleteHike = async (req, res) => {
    try {
        await Hike.findByIdAndDelete(req.params.id);
        res.json({ message: 'Hike deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
