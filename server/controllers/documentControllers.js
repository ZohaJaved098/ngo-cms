const Document = require("../models/documentModel");

// Helpers for URLs
const getBannerUrl = (req) =>
  req.files?.bannerImage
    ? `${req.protocol}://${req.get("host")}/uploads/pages/${
        req.files.bannerImage[0].filename
      }`
    : undefined;

const getFileUrl = (req) =>
  req.files?.file
    ? `${req.protocol}://${req.get("host")}/uploads/documents/${
        req.files.file[0].filename
      }`
    : undefined;

// Create Document
const createDocument = async (req, res) => {
  try {
    const newDoc = new Document({
      name: req.body.name,
      description: req.body.description,
      bannerImage: getBannerUrl(req),
      fileUrl: getFileUrl(req),
      isPublished: false,
    });

    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ error: "Failed to create document" });
  }
};

// Get All Documents
const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

// Get Document by ID
const getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    res.json(doc);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ error: "Failed to fetch document" });
  }
};

// Update Document
const updateDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    doc.name = req.body.name || doc.name;
    doc.description = req.body.description || doc.description;
    if (req.files?.bannerImage) doc.bannerImage = getBannerUrl(req);
    if (req.files?.file) doc.fileUrl = getFileUrl(req);

    await doc.save();
    res.json(doc);
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Failed to update document" });
  }
};

// Toggle Publish/Unpublish
const togglePublish = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    doc.isPublished = !doc.isPublished;
    await doc.save();

    res.json(doc);
  } catch (error) {
    console.error("Error toggling publish:", error);
    res.status(500).json({ error: "Failed to toggle publish" });
  }
};

// Delete Document
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ error: "Failed to delete document" });
  }
};

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  togglePublish,
  deleteDocument,
};
