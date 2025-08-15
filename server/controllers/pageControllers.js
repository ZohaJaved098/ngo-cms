const Page = require("../models/pagesModel");

const slugRegex = /^\/[a-zA-Z0-9-/]+$/; // supports nested slugs like /parent/child

// ✅ Get all pages (admin/dashboard use)
const getPages = async (_req, res) => {
  try {
    const pages = await Page.find().populate("parent", "title slug");
    res.status(200).json({ message: "All pages", pages });
  } catch (error) {
    res.status(500).json({ message: "Error getting pages", error });
  }
};
const createPage = async (req, res) => {
  let { title, slug, content, isPublished, parent } = req.body;
  const errors = {};

  try {
    if (!title) errors.title = "Title is required";
    if (!slug) {
      errors.slug = "Slug is required";
    } else if (!slugRegex.test(slug)) {
      errors.slug =
        "Slug must start with / and contain only letters, numbers, hyphens, and slashes.";
    }
    if (!content) errors.content = "Content is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation errors", errors });
    }

    if (parent) {
      const parentPage = await Page.findById(parent);
      if (!parentPage) {
        return res.status(400).json({ message: "Invalid parent page ID" });
      }
      slug = `${parentPage.slug.replace(/\/$/, "")}/${slug.replace(/^\//, "")}`;
    }

    const newPage = new Page({
      title,
      slug,
      content,
      isPublished,
      parent: parent || null,
    });

    await newPage.save();
    res.status(201).json({
      message: `Page created successfully with title: ${newPage.title}`,
      newPage,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating page", error });
  }
};

// ✅ Get single page by ID
const viewPage = async (req, res) => {
  const pageId = req.params.id;
  try {
    const page = await Page.findById(pageId).populate("parent", "title slug");
    if (!page) return res.status(404).json({ message: "Page not found!" });

    res.status(200).json({ message: "Page info", page });
  } catch (error) {
    res.status(500).json({ message: `Error fetching page`, error });
  }
};

// ✅ Update a page
const updatePage = async (req, res) => {
  let { title, slug, content, isPublished, parent } = req.body;
  const pageId = req.params.id;
  const errors = {};

  try {
    const page = await Page.findById(pageId);
    if (!page) return res.status(404).json({ message: "Page not found!" });

    if (slug && !slugRegex.test(slug)) {
      errors.slug = "Invalid slug format";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation error", errors });
    }

    // 🔹 Auto-prefix slug if parent exists
    if (parent) {
      const parentPage = await Page.findById(parent);
      if (!parentPage) {
        return res.status(400).json({ message: "Invalid parent page ID" });
      }
      slug = `${parentPage.slug.replace(/\/$/, "")}/${slug.replace(/^\//, "")}`;
    }

    await Page.findByIdAndUpdate(
      pageId,
      {
        title,
        slug,
        content,
        isPublished,
        parent: parent || null,
      },
      { new: true }
    );

    res.status(200).json({ message: "Page updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating page", error });
  }
};

// ✅ Delete a page
const deletePage = async (req, res) => {
  const pageId = req.params.id;

  try {
    const page = await Page.findById(pageId);
    if (!page) return res.status(404).json({ message: "Page not found!" });

    await Page.findByIdAndDelete(pageId);
    res.status(200).json({ message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting page", error });
  }
};

// ✅ Get a page by its slug (frontend public use)
const getPageBySlug = async (req, res, slugParam) => {
  try {
    // console.log("Looking for slug:", slugParam);
    const page = await Page.findOne({ slug: slugParam, isPublished: true });
    if (!page) return res.status(404).json({ message: "Page not found!" });

    res.status(200).json({ message: "Public Page", page });
  } catch (error) {
    res.status(500).json({ message: "Error fetching page by slug", error });
  }
};

module.exports = {
  getPages,
  createPage,
  viewPage,
  updatePage,
  deletePage,
  getPageBySlug,
};
