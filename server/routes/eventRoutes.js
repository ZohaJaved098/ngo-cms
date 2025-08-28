const express = require("express");
const {
  createEvent,
  getEvents,
  viewEvent,
  updateEvent,
  deleteEvent,
  registerUserToEvent,
} = require("../controllers/eventControllers");

const authorizedRoles = require("../middlewares/roleMiddleware");
const verifyToken = require("../middlewares/authMiddleware");

const { uploadEventBanner } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/all-events", getEvents);
router.post(
  "/create",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadEventBanner.single("coverImage"),
  createEvent
);
router.get("/:id", viewEvent);
router.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadEventBanner.single("coverImage"),
  updateEvent
);
router.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deleteEvent
);

router.post("/register/:id", registerUserToEvent);
module.exports = router;
