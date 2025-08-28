const express = require("express");
const {
  createBlog,
  getBlogs,
  viewBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogControllers");

const authorizedRoles = require("../middlewares/roleMiddleware");
const verifyToken = require("../middlewares/authMiddleware");

const { uploadBlogBanner } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/all-blogs", getBlogs);
router.post(
  "/create",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadBlogBanner.single("headerImage"),
  createBlog
);
router.get("/:id", viewBlog);
router.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadBlogBanner.single("headerImage"),
  updateBlog
);
router.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deleteBlog
);

module.exports = router;
