const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    bannerImage: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);
