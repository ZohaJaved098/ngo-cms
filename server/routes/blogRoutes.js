const {
  createBlog,
  getBlogs,
  viewBlog,
  updateBlog,
  deleteBlog,
  uploadBlogPage,
} = require("../controllers/blogControllers");
const authorizedRoles = require("../middlewares/roleMiddleware");
const verifyToken = require("../middlewares/authMiddleware");
const express = require("express");
const { uploadBlogBanner } = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.get("/all-blogs", getBlogs);
router.post(
  "/create",
  verifyToken,
  authorizedRoles("admin", "manager"),
  createBlog
);
router.get("/:id", viewBlog);
router.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  updateBlog
);
router.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deleteBlog
);
router.post(
  "/:id/upload-banner",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadBlogBanner.single("headerImage"),
  uploadBlogPage
);
module.exports = router;
