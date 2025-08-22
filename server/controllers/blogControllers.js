const Blog = require("../models/blogsModel");

// Get all blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ message: `All blogs fetched`, blogs });
  } catch (error) {
    res.status(500).json({ message: "Error getting blogs", error });
  }
};

// Create a blog
const createBlog = async (req, res) => {
  const { name, typeOfBlog, content, author, tags, isPublished } = req.body;
  const errors = {};

  try {
    if (!name) errors.name = "Name is required";
    if (!typeOfBlog) errors.typeOfBlog = "Blog type is required";
    if (!content) errors.content = "Content is required";
    if (!author || !author.length) errors.author = "Author is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Error creating blog", errors });
    }

    const newBlog = new Blog({
      name,
      typeOfBlog,
      content,
      author,
      tags,
      isPublished,
      publishedDate: isPublished ? new Date() : null,
    });

    await newBlog.save();
    res.status(201).json({
      message: `Blog '${newBlog.name}' created successfully`,
      newBlog,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
  }
};

// View a blog
const viewBlog = async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: `Blog not found!` });

    res.status(200).json({ message: "Blog found", blog });
  } catch (error) {
    res.status(500).json({ message: `Error fetching blog`, error });
  }
};

// Update a blog
const updateBlog = async (req, res) => {
  const blogId = req.params.id;
  const { name, typeOfBlog, content, author, tags, isPublished } = req.body;
  const errors = {};

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: `Blog not found!` });

    if (!name) errors.name = "Name is required";
    if (!typeOfBlog) errors.typeOfBlog = "Blog type is required";
    if (!content) errors.content = "Content is required";
    if (!author || !author.length) errors.author = "Author is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Error updating blog", errors });
    }

    let publishedDate = blog.publishedDate;
    if (isPublished && !blog.isPublished) {
      publishedDate = new Date(); // Just got published
    } else if (!isPublished && blog.isPublished) {
      publishedDate = null; // Just got unpublished
    }

    await Blog.findByIdAndUpdate(
      blogId,
      {
        name,
        typeOfBlog,
        content,
        author,
        tags,
        isPublished,
        publishedDate,
      },
      { new: true }
    );

    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error });
  }
};

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: `Blog not found!` });

    await Blog.findByIdAndDelete(blogId);
    res.status(200).json({ message: `Blog deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: `Error deleting blog`, error });
  }
};

// Upload blog header image
const uploadBlogPage = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (req.file) {
      blog.headerImage = req.file.path; // save multer uploaded file path
      await blog.save();
    }

    res.json({ message: "Header image uploaded successfully", blog });
  } catch (error) {
    res.status(500).json({ message: "Error uploading blog header", error });
  }
};

module.exports = {
  getBlogs,
  createBlog,
  viewBlog,
  updateBlog,
  deleteBlog,
  uploadBlogPage,
};
