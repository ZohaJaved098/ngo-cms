const {
  createPage,
  getPages,
  viewPage,
  updatePage,
  deletePage,
  getPageBySlug,
  uploadPageImage,
} = require("../controllers/pageControllers");
const express = require("express");
const { uploadPageBanner } = require("../middlewares/uploadMiddleware");
const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");
const router = express.Router();

router.get("/slug/{*slug}", (req, res) => {
  const slug = decodeURIComponent(req.params.slug);
  getPageBySlug(req, res, slug);
});

router.get("/all-pages", getPages);
router.post(
  "/create",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadPageBanner.single("bannerImage"),
  createPage
);

router.get("/:id", viewPage);
router.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadPageBanner.single("bannerImage"),
  updatePage
);
router.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deletePage
);

module.exports = router;
