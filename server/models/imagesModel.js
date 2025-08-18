const mongoose = require("mongoose");

const ImagesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      required: true, // "/uploads/sliders/image1.jpg"
    },
    alt: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String, // optional slide text
    },
    link: {
      type: String, // optional CTA link
    },
    ctaText: {
      type: String, // optional CTA button text
    },
    order: {
      type: Number,
      default: 0, // for slider sorting
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Image", ImagesSchema);
