const mongoose = require("mongoose");

const BlogsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    typeOfBlog: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    headerImage: {
      type: String,
      required: false,
    },
    author: [
      {
        type: String,
        required: true,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
    publishedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", BlogsSchema);
