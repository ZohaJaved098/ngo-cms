const express = require("express");
const router = express.Router();
const {
  adminAccess,
  managerAccess,
  userAccess,
} = require("../controllers/userControllers");
const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");

router.get("/admin", verifyToken, authorizedRoles("admin"), adminAccess);

router.get(
  "/manager",
  verifyToken,
  authorizedRoles("admin", "manager"),
  managerAccess
);

router.get(
  "/user",
  verifyToken,
  authorizedRoles("admin", "manager", "user"),
  userAccess
);

module.exports = router;
