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

//  Public - get all
router.get("/all-documents", getAllDocuments);

//  Public - single doc by id
router.get("/:id", getDocumentById);

//  Protected - create
router.post(
  "/create",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadBannerAndFile,
  createDocument
);

//  Protected - update
router.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadBannerAndFile,
  updateDocument
);

//  Protected - toggle publish/unpublish
router.patch(
  "/:id/toggle",
  verifyToken,
  authorizedRoles("admin", "manager"),
  togglePublish
);

//  Protected - delete
router.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deleteDocument
);

module.exports = router;
