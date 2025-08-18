const Image = require("../models/imagesModel");

//all Images
const getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ order: 1, createdAt: -1 });
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const formattedImages = images.map((img) => ({
      ...img._doc,
      imageUrl: `${baseUrl}${img.imagePath}`, // prepend full URL
    }));

    res.status(200).json({ message: "All Images", images: formattedImages });
  } catch (error) {
    res.status(500).json({ message: "Error getting all Images", error });
  }
};

// Create Image
const createImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const { name, alt, title, description, link, ctaText, order } = req.body;

    if (!name || !alt || !title) {
      return res
        .status(400)
        .json({ message: "Name, alt, and title are required" });
    }

    const newImage = new Image({
      name,
      imagePath: `/uploads/sliders/${req.file.filename}`,
      alt,
      title,
      description,
      link,
      ctaText,
      order: order || 0,
    });

    await newImage.save();

    res.status(201).json({
      message: `New slide created successfully: ${newImage.name}`,
      newImage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating new Image",
      error: error.message,
    });
  }
};

const viewImage = async (req, res) => {
  const imageId = req.params.id;
  try {
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: `Image not found!` });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const formattedImage = {
      ...image._doc,
      imageUrl: `${baseUrl}${image.imagePath}`,
    };

    res.status(200).json({
      message: "Image info",
      image: formattedImage,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching one Image of id ${imageId}`, error });
  }
};

// Update Image
const updateImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const existingImage = await Image.findById(imageId);

    if (!existingImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    const updatedData = {
      name: req.body.name || existingImage.name,
      alt: req.body.alt || existingImage.alt,
      title: req.body.title || existingImage.title,
      description: req.body.description || existingImage.description,
      link: req.body.link || existingImage.link,
      ctaText: req.body.ctaText || existingImage.ctaText,
      order: req.body.order ?? existingImage.order,
    };

    // If a new file is uploaded, replace the imagePath
    if (req.file) {
      updatedData.imagePath = `/uploads/sliders/${req.file.filename}`;
    }

    const updatedImage = await Image.findByIdAndUpdate(imageId, updatedData, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Image updated successfully", updatedImage });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating image", error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await Image.findById(imageId);

    if (!image) return res.status(404).json({ message: `Image not found!` });

    await Image.findByIdAndDelete(imageId);

    res.status(200).json({ message: `Image Deleted` });
  } catch (error) {
    res.status(500).json({ message: `Error deleting Image`, error });
  }
};

module.exports = {
  getImages,
  createImage,
  viewImage,
  updateImage,
  deleteImage,
};
