const mongoose = require("mongoose");
//images slider for home page
const ImagesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    srcLink: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Images", ImagesSchema);
