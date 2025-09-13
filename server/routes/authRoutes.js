const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authControllers");
const { uploadProfilePic } = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", uploadProfilePic.single("profilePic"), registerUser);
router.post(`/logout`, logoutUser);

module.exports = router;
