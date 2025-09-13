const express = require("express");
const {
  getVolunteers,
  applyVolunteer,
  updateVolunteerStatus,
  deleteVolunteer,
} = require("../controllers/volunteerControllers");
const authorizedRoles = require("../middlewares/roleMiddleware");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/",
  verifyToken,
  authorizedRoles("admin", "manager"),
  getVolunteers
);
router.post("/apply", applyVolunteer);
router.put(
  "/:id/status",
  verifyToken,
  authorizedRoles("admin", "manager"),
  updateVolunteerStatus
);
router.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deleteVolunteer
);

module.exports = router;
