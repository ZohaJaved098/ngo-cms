const express = require("express");
const router = express.Router();
const {
  createImage,
  getImages,
  viewImage,
  updateImage,
  deleteImage,
} = require("../controllers/imagesControllers");

const authorizedRoles = require("../middlewares/roleMiddleware");
const verifyToken = require("../middlewares/authMiddleware");
const { uploadSlider } = require("../middlewares/uploadMiddleware");

router.get("/all-images", getImages);

router.post(
  "/create",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadSlider.single("image"),
  createImage
);

router.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadSlider.single("image"),
  updateImage
);

router.get("/:id", verifyToken, authorizedRoles("admin", "manager"), viewImage);

router.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deleteImage
);

module.exports = router;
