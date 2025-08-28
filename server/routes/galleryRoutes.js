const express = require("express");
const router = express.Router();

const {
  getGalleries,
  createGallery,
  viewGallery,
  updateGallery,
  deleteGallery,
  togglePublishGallery,
  viewGalleryImage,
  editGalleryImage,
  deleteGalleryImage,
} = require("../controllers/galleryControllers");

const authorizedRoles = require("../middlewares/roleMiddleware");
const verifyToken = require("../middlewares/authMiddleware");
const { uploadGallery } = require("../middlewares/uploadMiddleware");

//  Album routes
router.get("/all-galleries", getGalleries);

router.post(
  "/create",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadGallery.array("images", 10),
  createGallery
);

router.get("/:id", viewGallery);

router.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadGallery.array("images", 10),
  updateGallery
);

router.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deleteGallery
);

router.patch(
  "/:id/toggle-publish",
  verifyToken,
  authorizedRoles("admin", "manager"),
  togglePublishGallery
);

// 🖼️ Image routes
router.get("/:id/images/:imageId", viewGalleryImage);

router.put(
  "/:id/images/:imageId",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadGallery.single("image"),
  editGalleryImage
);

router.delete(
  "/:id/images/:imageId",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deleteGalleryImage
);

module.exports = router;
