// contentRoutes.js
const express = require("express");
const router = express.Router();
const { uploadContentImage } = require("../middlewares/uploadMiddleware");

router.post("/upload", uploadContentImage.single("upload"), (req, res) => {
  res.status(201).json({
    uploaded: true,
    url: `http://localhost:5000/uploads/content/${req.file.filename}`,
  });
});

module.exports = router;
