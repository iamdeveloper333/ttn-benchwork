const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  availability: { type: Boolean, required: true },
  price: { type: Number, required: true },
  inventory: { type: Number, required: true },
  imageUrl: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
