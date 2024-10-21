const Cart = require("../models/Cart");
const ClassType = require("../models/ClassType");
const YogaCourse = require("../models/YogaCourse");

exports.getCart = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const cart = await Cart.findOne({ user: req.session.userId })
      .populate("items.classType")
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

  const { classTypeId, yogaCourseId, pricePerClass } = req.body;

  try {
    const yogaCourseObjectId = String(yogaCourseId);
    const classTypeObjectId = String(classTypeId);

    const classType = await ClassType.findById(classTypeObjectId);
    const yogaCourse = await YogaCourse.findById(yogaCourseObjectId);
    if (!classType || !yogaCourse) {
      return res.status(404).json({ message: "ClassType or YogaCourse not found" });
    }

    let cart = await Cart.findOne({ user: req.session.userId });
    if (!cart) {
      cart = new Cart({ user: req.session.userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.classType.toString() === classTypeObjectId && item.yogaCourse.toString() === yogaCourseObjectId
    );
    if (existingItem) {
      return res.status(400).json({ message: "Class already in cart" });
    }

    cart.items.push({ classType: classTypeObjectId, yogaCourse: yogaCourseObjectId, pricePerClass });
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

  const { classTypeId } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.session.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.classType.toString() !== classTypeId
    );
    await cart.save();

    res.status(200).json({ message: "Class removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
