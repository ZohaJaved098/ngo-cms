const {
  createPage,
  getPages,
  viewPage,
  updatePage,
  deletePage,
  getPageBySlug,
} = require("../controllers/pageControllers");
const express = require("express");
const router = express.Router();

router.get("/slug/{*slug}", (req, res) => {
  const slug = decodeURIComponent(req.params.slug);
  getPageBySlug(req, res, slug);
});

router.get("/all-pages", getPages);
router.post("/create", createPage);

router.get("/:id", viewPage);
router.put("/:id", updatePage);
router.delete("/:id", deletePage);

module.exports = router;
