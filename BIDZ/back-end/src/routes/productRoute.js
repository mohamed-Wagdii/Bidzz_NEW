import express from "express";
import multer from "multer";
import path from "path";
import { createProduct } from "../controller/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";

// Multer config — same storage as the upload route
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/images"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const router = express.Router();

// POST /api/products — create product (seller only), image required
/**
 * POST /
 * Creates a new product for a seller. Handles image uploads via Multer.
 */
router.post("/", authMiddleware, upload.array("images", 10), createProduct);

// GET /api/products/my — seller's own products
/**
 * GET /my
 * Retrieves a list of all products owned by the authenticated seller.
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
