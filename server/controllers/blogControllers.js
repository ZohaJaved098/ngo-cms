const Blog = require("../models/blogsModel");
const { toArray, toBool } = require("../utils/helper");

const headerImageUrl = (req) =>
  req.file
    ? `${req.protocol}://${req.get("host")}/uploads/blogs/${req.file.filename}`
    : undefined;

// get all blogs
const getBlogs = async (_req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ message: "All blogs fetched", blogs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting blogs", error: error.message });
  }
};

//create blog
const createBlog = async (req, res) => {
  const { name, typeOfBlog, content } = req.body;
  const author = toArray(req.body.author);
  const tags = toArray(req.body.tags);
  const isPublished = toBool(req.body.isPublished);
  const errors = {};

  try {
    if (!name) errors.name = "Name is required";
    if (!typeOfBlog) errors.typeOfBlog = "Blog type is required";
    if (!content) errors.content = "Content is required";
    if (!author.length) errors.author = "Author is required";

    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Validation errors", errors });
    }

    const newBlog = await Blog.create({
      name,
      typeOfBlog,
      content,
      author,
      tags,
      isPublished,
      headerImage: headerImageUrl(req) ?? null,
      publishedDate: isPublished ? new Date() : null,
    });

    res.status(201).json({
      message: `Blog '${newBlog.name}' created successfully`,
      blog: newBlog,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Blog creation failed",
        errors: { name: "Blog name already exists" },
      });
    }
    res
      .status(500)
      .json({ message: "Error creating blog", error: error.message });
  }
};

const viewBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found!" });
    res.status(200).json({ message: "Blog found", blog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blog", error: error.message });
  }
};

const updateBlog = async (req, res) => {
  const { name, typeOfBlog, content } = req.body;
  const author = toArray(req.body.author);
  const tags = toArray(req.body.tags);
  const isPublished = toBool(req.body.isPublished);

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found!" });

    // Published date transition logic
    let publishedDate = blog.publishedDate;
    if (isPublished && !blog.isPublished) publishedDate = new Date();
    if (!isPublished && blog.isPublished) publishedDate = null;

    const newHeader = headerImageUrl(req);
    const update = {
      name,
      typeOfBlog,
      content,
      author,
      tags,
      isPublished,
      publishedDate,
    };
    if (newHeader) update.headerImage = newHeader;

    const updated = await Blog.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Blog update failed",
        errors: { name: "Blog name already exists" },
      });
    }
    res
      .status(500)
      .json({ message: "Error updating blog", error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found!" });

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting blog", error: error.message });
  }
};

module.exports = {
  getBlogs,
  createBlog,
  viewBlog,
  updateBlog,
  deleteBlog,
};
