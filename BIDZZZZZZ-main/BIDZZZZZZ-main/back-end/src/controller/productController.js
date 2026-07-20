import Product from "../models/Product.js";

// Strip HTML tags and trim — lightweight XSS prevention without extra deps
function sanitizeString(str) {
  return String(str).replace(/<[^>]*>/g, "").trim();
}

export const createProduct = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can create products" });
    }

    const { name, description, price } = req.body;

    if (!name || !description || price === undefined || price === null || price === "") {
      return res.status(400).json({ message: "Name, description, and price are required" });
    }

    const cleanName = sanitizeString(name);
    const cleanDescription = sanitizeString(description);
    const parsedPrice = parseFloat(price);

    if (!cleanName || cleanName.length < 2 || cleanName.length > 200) {
      return res.status(400).json({ message: "Name must be between 2 and 200 characters" });
    }

    if (!cleanDescription || cleanDescription.length < 5 || cleanDescription.length > 2000) {
      return res.status(400).json({ message: "Description must be between 5 and 2000 characters" });
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    // Image is required — must be uploaded via multipart/form-data
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Product image is required." });
    }

    // Build public-accessible URLs served by Express static middleware at /images
    const imageUrls = req.files.map(f => `/images/${f.filename}`);

    const product = new Product({
      name: cleanName,
      description: cleanDescription,
      price: parsedPrice,
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
