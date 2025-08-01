const {
  createImage,
  getImages,
  viewImage,
  updateImage,
  deleteImage,
} = require("../controllers/imagesControllers");

const authorizedRoles = require("../middlewares/roleMiddleware");
const verifyToken = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();

router.get("/all-images", getImages);
router.post(
  "/create",
  verifyToken,
  authorizedRoles("admin", "manager"),
  createImage
);
router.get("/:id", verifyToken, authorizedRoles("admin", "manager"), viewImage);
router.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  updateImage
);
router.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deleteImage
);
module.exports = router;
