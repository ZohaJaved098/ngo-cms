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
  updateUser,
} = require("../controllers/userControllers");
const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");
const { uploadProfilePic } = require("../middlewares/uploadMiddleware");

router.get(
  "/admin/all-users",
  verifyToken,
  authorizedRoles("admin"),
  getAllUsers
);
router.delete("/:id", verifyToken, authorizedRoles("admin"), deleteUser);
router.put("/:id/role", verifyToken, authorizedRoles("admin"), updateUserRole);
router.post(
  "/create",
  verifyToken,
  authorizedRoles("admin"),
  uploadProfilePic.single("profilePic"),
  createNewUser
);
router.put(
  "/:id",
  verifyToken,
  uploadProfilePic.single("profilePic"),
  updateUser
);
router.get("/:id", verifyToken, getAUser);

module.exports = router;
