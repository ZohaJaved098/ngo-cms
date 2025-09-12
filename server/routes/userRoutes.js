const express = require("express");
const router = express.Router();
const {
  adminAccess,
  managerAccess,
  userAccess,
  getAllUsers,
  deleteUser,
  updateUserRole,
  createNewUser,
  getAUser,
} = require("../controllers/userControllers");
const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");

router.get("/admin", verifyToken, authorizedRoles("admin"), adminAccess);
router.get(
  "/admin/all-users",
  verifyToken,
  authorizedRoles("admin"),
  getAllUsers
);
router.delete("/:id", verifyToken, authorizedRoles("admin"), deleteUser);
router.put("/:id/role", verifyToken, authorizedRoles("admin"), updateUserRole);
router.post("/create", verifyToken, authorizedRoles("admin"), createNewUser);
router.get("/:id", verifyToken, getAUser);
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
