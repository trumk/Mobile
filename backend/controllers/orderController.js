const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const cart = await Cart.findOne({ user: req.session.userId }).populate('items.classType');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const totalAmount = cart.items.reduce((sum, item) => sum + item.classType.pricePerClass, 0);

        const order = new Order({
            user: req.session.userId,
            items: cart.items.map(item => ({
                classType: item.classType._id,
                pricePerClass: item.classType.pricePerClass
            })),
            totalAmount
        });

        await order.save();

        await Cart.findOneAndDelete({ user: req.session.userId });

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const orders = await Order.find({ user: req.session.userId }).populate('items.classType');
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    if (!req.session.userId || req.session.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only' });
    }

    const { orderId, status } = req.body;

    const validStatuses = ['Pending', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid order status' });
    }

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};