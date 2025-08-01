const {
  createBlog,
  getBlogs,
  viewBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogControllers");
const authorizedRoles = require("../middlewares/roleMiddleware");
const verifyToken = require("../middlewares/authMiddleware");
const express = require("express");
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
module.exports = router;
