const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const YogaCourse = require('../models/YogaCourse');

exports.createOrder = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const cart = await Cart.findOne({ user: req.session.userId })
            .populate('items.classType')
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
                classType: item.classType._id,
                yogaCourse: item.yogaCourse._id
            })),
            totalAmount
        });

        await order.save();

        // Xóa giỏ hàng sau khi tạo đơn hàng thành công
        await Cart.findOneAndDelete({ user: req.session.userId });

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('items.classType') 
            .populate({
                path: 'items.yogaCourse',
                populate: {
                    path: 'classType', 
                    model: 'ClassType',
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

exports.getOrderById = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const { orderId } = req.params;

    try {
        const order = await Order.findOne({ _id: orderId, user: req.session.userId })
            .populate('items.classType') 
            .populate({
                path: 'items.yogaCourse',
                populate: {
                    path: 'classType', 
                    model: 'ClassType',
                    select: '_id'
                }
            });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
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
        const order = await Order.findById(orderId).populate('items.yogaCourse');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Nếu trạng thái hiện tại của đơn hàng là "Completed" và trạng thái mới là "Pending" hoặc "Cancelled"
        if (order.status === 'Completed' && (status === 'Pending' || status === 'Cancelled')) {
            for (const item of order.items) {
                const yogaCourse = await YogaCourse.findById(item.yogaCourse);
                
                // Tăng capacity của khóa học
                if (yogaCourse) {
                    yogaCourse.capacity += 1;
                    // Loại bỏ user khỏi danh sách participants
                    yogaCourse.participants = yogaCourse.participants.filter(
                        participant => participant.toString() !== order.user.toString()
                    );
                    await yogaCourse.save();
                }

                // Loại bỏ khóa học khỏi danh sách courses của user
                const user = await User.findById(order.user);
                if (user) {
                    user.courses = user.courses.filter(
                        courseId => courseId.toString() !== yogaCourse._id.toString()
                    );
                    await user.save();
                }
            }
        }

        // Cập nhật trạng thái đơn hàng
        order.status = status;
        await order.save();

        // Nếu trạng thái mới là "Completed"
        if (status === 'Completed') {
            for (const item of order.items) {
                const yogaCourse = await YogaCourse.findById(item.yogaCourse);

                if (yogaCourse && !yogaCourse.participants.includes(order.user)) {
                    yogaCourse.participants.push(order.user);
                    await yogaCourse.save();

                    if (yogaCourse.capacity > 0) {
                        yogaCourse.capacity -= 1;
                        await yogaCourse.save();
                    }
                }

                const user = await User.findById(order.user);
                if (user && !user.courses.includes(yogaCourse._id)) {
                    user.courses.push(yogaCourse._id);
                    await user.save();
                }
            }
        }

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
