const express = require("express");
const { authenticateJWT } = require("../config/jwt");
const Product = require("../models/Product");
const sendEmail = require("../config/email");
const Order = require("../models/Order");
const Address = require("../models/Address");
const router = express.Router();

router.post("/", authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const { cart, addressId } = req.body;

  try {
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(400).json({ message: "Invalid address selected" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of cart) {
      const product = await Product.findById(item.product._id);

      if (product.inventory < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough inventory for ${product.name}` });
      }

      product.inventory -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      totalPrice += item.quantity * product.price;
    }

    const newOrder = new Order({
      user: userId,
      items: orderItems,
      totalPrice,
      address: address._id,
    });

    await newOrder.save();

    await sendEmail({
      email: req.user.email,
      subject: "Order Confirmation",
      message: "Your order has been placed successfully.",
    });

    res.status(201).json({ message: "Order placed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
router.get("/", authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ user: userId }).populate("items.product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
