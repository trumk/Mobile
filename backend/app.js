const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const hikeRoutes = require('./routes/hikeRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', hikeRoutes);
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        console.error('Validation Error:', err); 
        return res.status(400).send({ error: 'Invalid request data' });
    }
    next(err);
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

module.exports = app;
