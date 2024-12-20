const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const YogaCourse = require('../models/YogaCourse');
const Class = require('../models/Class');

exports.createOrder = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const cart = await Cart.findOne({ user: req.session.userId })
            .populate('items.class')
            .populate('items.yogaCourse');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const totalAmount = cart.items.reduce(
            (sum, item) => sum + (item.yogaCourse.pricePerClass || 0),
            0
        );

        const order = new Order({
            user: req.session.userId,
            items: cart.items.map(item => ({
                class: item.class._id,
                yogaCourse: item.yogaCourse._id
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
    try {
        const orders = await Order.find()
            .populate('items.class') 
            .populate({
                path: 'items.yogaCourse',
                populate: {
                    path: 'class',
                    model: 'Class',
                    select: '_id'
                }
            });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrdersByUserId = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const { userId } = req.params;

    try {
        const orders = await Order.find({ user: userId })
            .populate('items.class')
            .populate({
                path: 'items.yogaCourse',
                populate: {
                    path: 'class',
                    model: 'Class',
                    select: '_id'
                }
            });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;

    const validStatuses = ['Pending', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid order status' });
    }

    try {
        const order = await Order.findById(orderId).populate('items.yogaCourse items.class');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status === 'Completed' && (status === 'Pending' || status === 'Cancelled')) {
            for (const item of order.items) {
                const yogaCourse = await YogaCourse.findById(item.yogaCourse);
                const cls = await Class.findById(item.class);

                if (yogaCourse) {
                    yogaCourse.capacity += 1;
                    yogaCourse.participants = yogaCourse.participants.filter(
                        participant => participant.toString() !== order.user.toString()
                    );
                    await yogaCourse.save();
                }

                if (cls) {
                    cls.participants = cls.participants.filter(
                        participant => participant.toString() !== order.user.toString()
                    );
                    await cls.save();
                }

                const user = await User.findById(order.user);
                if (user) {
                    user.courses = user.courses.filter(
                        courseId => courseId.toString() !== yogaCourse._id.toString()
                    );
                    user.classes = user.classes.filter(
                        classId => classId.toString() !== cls._id.toString()
                    );
                    await user.save();
                }
            }
        }

        // Cập nhật trạng thái mới
        order.status = status;
        await order.save();

        // Nếu order được đánh dấu là "Completed"
        if (status === 'Completed') {
            for (const item of order.items) {
                const yogaCourse = await YogaCourse.findById(item.yogaCourse);
                const cls = await Class.findById(item.class);

                if (yogaCourse && !yogaCourse.participants.includes(order.user)) {
                    yogaCourse.participants.push(order.user);

                    if (cls && cls._id && !yogaCourse.class.includes(cls._id)) {
                        yogaCourse.class.push(cls._id);
                    }

                    yogaCourse.class = yogaCourse.class.filter((clsId) => clsId !== null);

                    if (yogaCourse.capacity > 0) {
                        yogaCourse.capacity -= 1;
                    }
                    await yogaCourse.save();
                }

                if (cls && !cls.participants.includes(order.user)) {
                    cls.participants.push(order.user);
                    await cls.save();
                }

                const user = await User.findById(order.user);
                if (user) {
                    if (!user.courses.includes(yogaCourse._id)) {
                        user.courses.push(yogaCourse._id);
                    }
                    if (!user.classes.includes(cls._id)) {
                        user.classes.push(cls._id);
                    }
                    await user.save();
                }
            }
        }

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
};
