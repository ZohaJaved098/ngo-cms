const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String },
    caption: { type: String },
  },
  { timestamps: true }
);

const GallerySchema = new mongoose.Schema(
  {
    albumTitle: { type: String, required: true, unique: true },
    albumDescription: { type: String },
    isPublished: { type: Boolean, default: false },
    images: [ImageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema);
