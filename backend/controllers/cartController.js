const Cart = require("../models/Cart");
const Class = require("../models/Class");
const YogaCourse = require("../models/YogaCourse");

exports.getCart = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const cart = await Cart.findOne({ user: req.session.userId })
            .populate("items.class")
            .populate("items.yogaCourse");

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addToCart = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const { classId, yogaCourseId, pricePerClass } = req.body;

    try {
        const yogaCourse = await YogaCourse.findById(yogaCourseId);
        const classItem = await Class.findById(classId);

        if (!classItem || !yogaCourse) {
            return res.status(404).json({ message: "Class or YogaCourse not found" });
        }

        let cart = await Cart.findOne({ user: req.session.userId });
        if (!cart) {
            cart = new Cart({ user: req.session.userId, items: [] });
        }

        const existingItem = cart.items.find(
            (item) => item.class.toString() === classId && item.yogaCourse.toString() === yogaCourseId
        );

        if (existingItem) {
            return res.status(400).json({ message: "Class already in cart" });
        }

        cart.items.push({ class: classId, yogaCourse: yogaCourseId, pricePerClass });
        await cart.save();

        res.status(200).json({ message: "Class added to cart", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const { classId } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.session.userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            (item) => item.class.toString() !== classId
        );
        await cart.save();

        res.status(200).json({ message: "Class removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};