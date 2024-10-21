const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/create', orderController.createOrder);

router.get('/', orderController.getOrders);

router.put('/update-status', orderController.updateOrderStatus);

module.exports = router;
