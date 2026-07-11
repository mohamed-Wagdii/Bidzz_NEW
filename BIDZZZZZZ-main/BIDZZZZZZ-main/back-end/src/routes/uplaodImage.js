import express from "express";
import multer from "multer";
import path from "path";
import authMiddleware from "../middleware/authMiddleware.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/images"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

const router = express.Router();

router.post("/", authMiddleware, upload.array("images", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const urls = req.files.map(f => `/src/images/${f.filename}`);
    res.json({ message: "Images uploaded successfully", urls });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
