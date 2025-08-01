const {
  createEvent,
  getEvents,
  viewEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventControllers");
const authorizedRoles = require("../middlewares/roleMiddleware");
const verifyToken = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();

router.get("/all-events", getEvents);
router.post(
  "/create",
  verifyToken,
  authorizedRoles("admin", "manager"),
  createEvent
);
router.get("/:id", viewEvent);
router.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  updateEvent
);
router.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deleteEvent
);
module.exports = router;
