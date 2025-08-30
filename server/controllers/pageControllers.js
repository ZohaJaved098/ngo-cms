const Page = require("../models/pagesModel");

const slugRegex = /^\/[a-zA-Z0-9-/]+$/; // supports nested slugs like /parent/child
const bannerImageUrl = (req) =>
  req.file
    ? `${req.protocol}://${req.get("host")}/uploads/pages/${req.file.filename}`
    : undefined;

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
      bannerImage: bannerImageUrl(req) ?? null,
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

    if (parent) {
      const parentPage = await Page.findById(parent);
      if (!parentPage) {
        return res.status(400).json({ message: "Invalid parent page ID" });
      }
      slug = `${parentPage.slug.replace(/\/$/, "")}/${slug.replace(/^\//, "")}`;
    }

    const newBanner = bannerImageUrl(req);
    const update = {
      title,
      slug,
      content,
      isPublished,
      parent: parent || null,
    };
    if (newBanner) update.bannerImage = newBanner;

    const updated = await Page.findByIdAndUpdate(pageId, update, { new: true });

    res.status(200).json({ message: "Page updated successfully", updated });
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

const getPageBySlug = async (req, res, slugParam) => {
  try {
    const page = await Page.findOne({ slug: slugParam, isPublished: true });
    if (!page) return res.status(404).json({ message: "Page not found!" });

    res.status(200).json({ message: "Public Page", page });
  } catch (error) {
    res.status(500).json({ message: "Error fetching page by slug", error });
  }
};
// handle file upload for page banner
const uploadPageImage = async (req, res) => {
  try {
    const pageId = req.params.id;
    const page = await Page.findById(pageId);

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    if (req.file) {
      page.banner = req.file.path; // assuming your Page model has `banner`
      await page.save();
    }

    res.json({ message: "Banner uploaded successfully", page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPages,
  createPage,
  viewPage,
  updatePage,
  deletePage,
  getPageBySlug,
  uploadPageImage,
};
