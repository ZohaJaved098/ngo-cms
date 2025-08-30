const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");
const { uploadBannerAndFile } = require("../middlewares/uploadMiddleware");

const {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  togglePublish,
  deleteDocument,
} = require("../controllers/documentControllers");

router.get("/all-documents", getAllDocuments);

router.get("/:id", getDocumentById);

router.post(
  "/create",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadBannerAndFile,
  createDocument
);

router.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadBannerAndFile,
  updateDocument
);

router.patch(
  "/:id/toggle",
  verifyToken,
  authorizedRoles("admin", "manager"),
  togglePublish
);

router.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deleteDocument
);

module.exports = router;
