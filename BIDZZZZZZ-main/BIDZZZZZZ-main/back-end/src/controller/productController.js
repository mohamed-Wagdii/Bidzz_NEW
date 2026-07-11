import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can create products" });
    }

    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ message: "Name, description, and price are required" });
    }

    if (parseFloat(price) <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    // Image is required — must be uploaded via multipart/form-data
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Product image is required." });
    }

    // Build public-accessible URLs served by Express static middleware at /images
    const imageUrls = req.files.map(f => `/images/${f.filename}`);

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      image: imageUrls,
      seller: req.user._id,
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
