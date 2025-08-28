const Gallery = require("../models/galleryModel");
const fs = require("fs");
const path = require("path");

// ✅ Create new Gallery (Album)
const createGallery = async (req, res) => {
  try {
    const { albumTitle, albumDescription } = req.body;

    // Prevent duplicate albumTitle
    const existing = await Gallery.findOne({ albumTitle });
    if (existing) {
      return res.status(400).json({ message: "Album title must be unique." });
    }
    let captions = req.body.captions || [];
    if (!Array.isArray(captions)) {
      captions = [captions];
    }

    const images = req.files.map((file, index) => ({
      url: `${req.protocol}://${req.get(
        "host"
      )}/uploads/galleries/${albumTitle}/${file.filename}`,
      alt: file.originalname,
      caption: captions[index] || "",
    }));

    const newGallery = new Gallery({
      albumTitle,
      albumDescription,
      images,
    });

    await newGallery.save();
    res.status(201).json(newGallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all Galleries
const getGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find();
    res.status(200).json(galleries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ View single Gallery
const viewGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });
    res.status(200).json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGallery = async (req, res) => {
  try {
    const { albumTitle, albumDescription } = req.body;
    let { existingCaptions, removeImages } = req.body;
    try {
      if (typeof existingCaptions === "string")
        existingCaptions = JSON.parse(existingCaptions);
    } catch {}
    try {
      if (typeof removeImages === "string")
        removeImages = JSON.parse(removeImages);
    } catch {}

    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    // Handle album title change
    if (albumTitle && albumTitle !== gallery.albumTitle) {
      const duplicate = await Gallery.findOne({ albumTitle });
      if (duplicate) {
        return res.status(400).json({ message: "Album title must be unique." });
      }
      gallery.albumTitle = albumTitle;
    }

    // Update description
    if (albumDescription) gallery.albumDescription = albumDescription;

    // ✅ Update captions of existing images
    if (existingCaptions) {
      // existingCaptions comes as { imageId: "new caption", ... }
      for (const [imgId, newCaption] of Object.entries(existingCaptions)) {
        const image = gallery.images.id(imgId);
        if (image) {
          image.caption = newCaption;
        }
      }
    }

    // ✅ Remove selected images
    if (removeImages && Array.isArray(removeImages)) {
      for (const imgId of removeImages) {
        const image = gallery.images.id(imgId);
        if (image) {
          const filePath = path.join(
            process.cwd(),
            "uploads",
            "galleries",
            gallery.albumTitle,
            path.basename(image.url)
          );
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          image.deleteOne();
        }
      }
    }

    // ✅ Add new images (if uploaded)
    let captions = req.body.captions || [];
    if (!Array.isArray(captions)) captions = [captions];

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `${req.protocol}://${req.get("host")}/uploads/galleries/${
          gallery.albumTitle
        }/${file.filename}`,
        alt: file.originalname,
        caption: captions[index] || "",
      }));
      gallery.images.push(...newImages);
    }

    await gallery.save();
    res.status(200).json(gallery);
  } catch (error) {
    console.error("Error updating gallery:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Gallery (and its images folder)
const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    // Remove folder from filesystem
    const albumPath = path.join(
      process.cwd(),
      "uploads",
      "galleries",
      gallery.albumTitle
    );
    if (fs.existsSync(albumPath)) {
      fs.rmSync(albumPath, { recursive: true, force: true });
    }

    await gallery.deleteOne();
    res.status(200).json({ message: "Gallery deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Toggle publish/unpublish
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
    res.status(500).json({ message: error.message });
  }
};

// ✅ View single Image in a gallery
const viewGalleryImage = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    const image = gallery.images.id(req.params.imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });

    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Edit Image (replace file + update metadata)
const editGalleryImage = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    const image = gallery.images.id(req.params.imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });

    // Replace image file
    if (req.file) {
      image.url = `${req.protocol}://${req.get("host")}/uploads/galleries/${
        gallery.albumTitle
      }/${req.file.filename}`;
      image.alt = req.file.originalname;
    }

    // Update caption if provided
    if (req.body.caption !== undefined) image.caption = req.body.caption;

    await gallery.save();
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Image (from gallery + filesystem)
const deleteGalleryImage = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    const image = gallery.images.id(req.params.imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });

    // Remove file from filesystem
    const filePath = path.join(
      process.cwd(),
      "uploads",
      "galleries",
      gallery.albumTitle,
      path.basename(image.url)
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from MongoDB
    image.deleteOne();
    await gallery.save();

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createGallery,
  getGalleries,
  viewGallery,
  updateGallery,
  deleteGallery,
  togglePublishGallery,
  viewGalleryImage,
  editGalleryImage,
  deleteGalleryImage,
};
