const Page = require("../models/pagesModel");
const slugRegex = /^\/[a-zA-Z0-9-]+$/;

const getPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.status(200).json({ message: `All pages are`, pages });
  } catch (error) {
    res.status(500).json({ message: "Error getting all pages", error });
  }
};
const createPage = async (req, res) => {
  const { title, slug, content, status } = req.body;
  const errors = {};
  try {
    if (!title) {
      errors.title = "Title is required";
    }

    if (!slug) {
      errors.slug = "Slug is required";
    } else if (!slugRegex.test(slug)) {
      errors.slug =
        "Invalid Slug! Slug can't have special character except - and must start with / ";
    }

    if (!content) {
      errors.content = "Content is required";
    }

    if (!status) {
      errors.status = "Status is required";
    }

    if (Object.keys(errors).length > 0) {
      return res
        .status(400)
        .json({ message: `Error Creating pages!`, errors: errors });
    }
    //if no errors proceed
    const newPage = new Page({
      title,
      slug,
      content,
      status,
    });
    await newPage.save();
    res.status(201).json({
      message: `New Page created successfully with title: ${newPage.title} `,
      newPage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating new page",
      error,
    });
  }
};
const viewPage = async (req, res) => {
  const pageId = req.params.id;
  try {
    const page = await Page.findById(pageId);

    if (!page) return res.status(404).json({ message: `Page not found!` });

    res.json({
      message: "Page info",
      page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching one Page of id ${pageId}`, error });
  }
};

const updatePage = async (req, res) => {
  const errors = {};
  try {
    const pageId = req.params.id;
    const { title, slug, content, status } = req.body;
    const page = await Page.findById(pageId);
    if (!page) return res.status(404).json({ message: `Page not found!` });

    if (slug && !slugRegex.test(slug)) {
      errors.slug =
        "Invalid Slug! Slug can't have special character except - and must start with /  ";
    }

    await Page.findByIdAndUpdate(
      pageId,
      { title, slug, content, status },
      { new: true }
    );
    res.status(200).json({ message: `page updated` });
  } catch (error) {
    res.status(500).json({ message: `error Updating page ` });
  }
};
const deletePage = async (req, res) => {
  try {
    const pageId = req.params.id;
    const page = await Page.findById(pageId);
    if (!page) return res.status(404).json({ message: `Page not found!` });
    await Page.findByIdAndDelete(pageId);
    res.status(200).json({ message: `Page Deleted` });
  } catch (error) {
    res.status(500).json({ message: `Error deleting page`, error });
  }
};

module.exports = { getPages, createPage, viewPage, updatePage, deletePage };
