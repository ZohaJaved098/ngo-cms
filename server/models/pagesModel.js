const { type } = require("express/lib/response");
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
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["published", "unpublished", "inProgress"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Page", PagesSchema);
