const express = require('express');
const { getAllHikes, createHike, updateHike, deleteHike } = require('../controllers/hikeController');
const router = express.Router();

router.get('/hikes', getAllHikes);
router.post('/hikes', createHike);
router.put('/hikes/:id', updateHike);
router.delete('/hikes/:id', deleteHike);

module.exports = router;
