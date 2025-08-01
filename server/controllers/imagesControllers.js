const Image = require("../models/imagesModel");

//all Images
const getImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json({ message: `All Images are`, images });
  } catch (error) {
    res.status(500).json({ message: "Error getting all Images", error });
  }
};
//create Image
const createImage = async (req, res) => {
  const { name, srcLink, alt, title } = req.body;
  const errors = {};
  try {
    if (!name) {
      errors.name = "Name is required";
    }
    if (!srcLink) {
      errors.srcLink = "Image Link is required";
    }

    if (!alt) {
      errors.alt = "alt is required";
    }

    if (!title) {
      errors.title = "Title is required";
    }

    if (Object.keys(errors).length > 0) {
      return res
        .status(400)
        .json({ message: `Error Creating Images!`, errors: errors });
    }
    //if no errors proceed
    const newImage = new Image({
      name,
      srcLink,
      alt,
      title,
    });
    await newImage.save();
    res.status(201).json({
      message: `New Image created successfully with title: ${newImage.name} `,
      newImage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating new Image",
      error,
    });
  }
};
const viewImage = async (req, res) => {
  const imageId = req.params.id;
  try {
    const image = await Image.findById(imageId);

    if (!image) return res.status(404).json({ message: `Image not found!` });

    res.status(200).json({
      message: "Image info",
      image,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching one Image of id ${imageId}`, error });
  }
};

const updateImage = async (req, res) => {
  const errors = {};
  try {
    const imageId = req.params.id;
    const { name, srcLink, alt, title } = req.body;
    const image = await Image.findById(imageId);
    if (!image) return res.status(404).json({ message: `Image not found!` });

    await Image.findByIdAndUpdate(
      imageId,
      {
        name,
        srcLink,
        alt,
        title,
      },
      { new: true }
    );
    res.status(200).json({ message: `Image updated` });
  } catch (error) {
    res.status(500).json({ message: `error Updating Image ` });
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
