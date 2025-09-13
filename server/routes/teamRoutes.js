const express = require("express");
const {
  getAllTeam,
  createTeamMember,
  deleteTeamMember,
  getATeam,
  updateTeam,
} = require("../controllers/teamController.js");
const authorizedRoles = require("../middlewares/roleMiddleware");
const verifyToken = require("../middlewares/authMiddleware");
const { uploadMemberPic } = require("../middlewares/uploadMiddleware.js");
const router = express.Router();

router.get("/", getAllTeam);
router.get("/:id", verifyToken, authorizedRoles("admin", "manager"), getATeam);
router.post(
  "/create",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadMemberPic.single("memberPic"),
  createTeamMember
);
router.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadMemberPic.single("memberPic"),
  updateTeam
);
router.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deleteTeamMember
);

module.exports = router;
