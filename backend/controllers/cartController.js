const Cart = require("../models/Cart");
const ClassType = require("../models/ClassType");

exports.getCart = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const cart = await Cart.findOne({ user: req.session.userId }).populate(
      "items.classType"
    );
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

  const { classTypeId, pricePerClass } = req.body;

  try {
    const classType = await ClassType.findById(classTypeId);
    if (!classType) {
      return res.status(404).json({ message: "Class type not found" });
    }

    let cart = await Cart.findOne({ user: req.session.userId });
    if (!cart) {
      cart = new Cart({ user: req.session.userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.classType.toString() === classTypeId
    );
    if (existingItem) {
      return res.status(400).json({ message: "Class already in cart" });
    }

    cart.items.push({ classType: classTypeId, pricePerClass });
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
