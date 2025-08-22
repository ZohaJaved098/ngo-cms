const Gallery = require("../models/galleryModel");
const fs = require("fs");

// ==================== Albums ====================

// Get all galleries (for dashboard table)
const getGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find();
    res.status(200).json({ message: "All galleries fetched", galleries });
  } catch (error) {
    res.status(500).json({ message: "Error fetching galleries", error });
  }
};

// Create album
const createGallery = async (req, res) => {
  const { albumTitle, albumDescription } = req.body;

  try {
    const images = req.files.map((file) => ({
      url: file.path,
      alt: req.body.alt || "",
      caption: req.body.caption || "",
    }));

    const newGallery = new Gallery({
      albumTitle,
      albumDescription,
      images,
    });

    await newGallery.save();
    res.status(201).json({ message: "Gallery created", newGallery });
  } catch (error) {
    res.status(500).json({ message: "Error creating gallery", error });
  }
};

// View single album
const viewGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });
    res.status(200).json({ message: "Gallery fetched", gallery });
  } catch (error) {
    res.status(500).json({ message: "Error fetching gallery", error });
  }
};

// Update album info & add new images
const updateGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    const { albumTitle, albumDescription } = req.body;
    if (albumTitle) gallery.albumTitle = albumTitle;
    if (albumDescription) gallery.albumDescription = albumDescription;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        alt: req.body.alt || "",
        caption: req.body.caption || "",
      }));
      gallery.images.push(...newImages);
    }

    await gallery.save();
    res.status(200).json({ message: "Gallery updated", gallery });
  } catch (error) {
    res.status(500).json({ message: "Error updating gallery", error });
  }
};

// Delete album
const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    // Remove files
    gallery.images.forEach((img) => {
      if (fs.existsSync(img.url)) fs.unlinkSync(img.url);
    });

    await gallery.deleteOne();
    res.status(200).json({ message: "Gallery deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting gallery", error });
  }
};

// Publish/unpublish album
const togglePublishGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    gallery.isPublished = !gallery.isPublished;
    await gallery.save();

    res.status(200).json({
      message: `Gallery ${gallery.isPublished ? "published" : "unpublished"}`,
      gallery,
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling publish", error });
  }
};

// ==================== Images ====================

// View single image
const viewGalleryImage = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    const image = gallery.images.id(req.params.imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });

    res.status(200).json({ message: "Image fetched", image });
  } catch (error) {
    res.status(500).json({ message: "Error fetching image", error });
  }
};

// Edit specific image
const editGalleryImage = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    const image = gallery.images.id(req.params.imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });

    if (req.file) {
      if (fs.existsSync(image.url)) fs.unlinkSync(image.url); // delete old file
      image.url = req.file.path;
    }

    if (req.body.alt) image.alt = req.body.alt;
    if (req.body.caption) image.caption = req.body.caption;

    await gallery.save();
    res.status(200).json({ message: "Image updated", image });
  } catch (error) {
    res.status(500).json({ message: "Error editing image", error });
  }
};

// Delete single image
const deleteGalleryImage = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    const image = gallery.images.id(req.params.imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });

    if (fs.existsSync(image.url)) fs.unlinkSync(image.url);

    image.deleteOne();
    await gallery.save();

    res.status(200).json({ message: "Image deleted", gallery });
  } catch (error) {
    res.status(500).json({ message: "Error deleting image", error });
  }
};

module.exports = {
  getGalleries,
  createGallery,
  viewGallery,
  updateGallery,
  deleteGallery,
  togglePublishGallery,
  viewGalleryImage,
  editGalleryImage,
  deleteGalleryImage,
};
