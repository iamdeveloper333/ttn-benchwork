const express = require("express");
const passport = require("passport");
const Product = require("../models/Product");
const Category = require("../models/Category");
const router = express.Router();
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const { authenticateJWT } = require("../config/jwt");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImageToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `${uuidv4()}-${file.originalname}`,
    Body: file.buffer,
  };

  const command = new PutObjectCommand(params);
  const response = await s3Client.send(command);
  return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
};

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/", authenticateJWT, upload.single("image"), async (req, res) => {
  const { name, availability, price, inventory, category } = req.body;
  let imageUrl;

  try {
    if (req.file) {
      imageUrl = await uploadImageToS3(req.file);
    }

    const categoryData = await Category.findById(category);
    if (!categoryData) {
      return res.status(404).json({ message: "Category not found" });
    }

    const newProduct = new Product({
      name,
      availability,
      price,
      inventory,
      imageUrl,
      category: categoryData._id,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.put(
  "/:id",
  authenticateJWT,
  upload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    const { name, availability, price, inventory, categoryId } = req.body;
    let imageUrl;

    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (req.file) {
        imageUrl = await uploadImageToS3(req.file);
      }

      product.name = name || product.name;
      product.availability = availability || product.availability;
      product.price = price || product.price;
      product.inventory = inventory || product.inventory;
      product.imageUrl = imageUrl || product.imageUrl;

      if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }
        product.category = category._id;
      }

      await product.save();
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

router.delete("/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.remove();
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
