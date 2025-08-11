const mongoose = require("mongoose");

const PagesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Page", PagesSchema);
