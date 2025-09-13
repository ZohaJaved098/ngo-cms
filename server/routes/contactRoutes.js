const express = require("express");
const {
  getContacts,
  addContact,
  deleteContact,
  updateContact,
  getAContact,
} = require("../controllers/contactControllers.js");
const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");
const { uploadContactIcon } = require("../middlewares/uploadMiddleware.js");

const router = express.Router();

router.get("/", getContacts);
router.get(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  getAContact
);
router.post(
  "/create",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadContactIcon.single("contactIcon"),
  addContact
);
router.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deleteContact
);
router.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadContactIcon.single("contactIcon"),
  updateContact
);

module.exports = router;
