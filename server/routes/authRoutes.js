const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("../controllers/authControllers");
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post(`/logout`, logoutUser);
router.get("/me", getMe);
module.exports = router;
