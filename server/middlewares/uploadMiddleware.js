const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Factory function for creating storage in different folders
function makeStorage(folderName) {
  const uploadPath = path.join(process.cwd(), "uploads", folderName);

  // Create folder if it doesn't exist
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        Date.now() + "-" + file.fieldname + path.extname(file.originalname)
      );
    },
  });
}

// File filter (same for all)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, or WebP images are allowed!"));
  }
};

// Uploaders
const uploadSlider = multer({ storage: makeStorage("sliders"), fileFilter });
const uploadPageBanner = multer({ storage: makeStorage("pages"), fileFilter });
const uploadBlogBanner = multer({ storage: makeStorage("blogs"), fileFilter });
const uploadEventBanner = multer({
  storage: makeStorage("events"),
  fileFilter,
});

// 🎯 Gallery with dynamic album folder
const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const albumTitle = req.body.albumTitle || "uncategorized";
    const albumPath = path.join(
      process.cwd(),
      "uploads",
      "galleries",
      albumTitle
    );

    // Create album folder if missing
    if (!fs.existsSync(albumPath)) {
      fs.mkdirSync(albumPath, { recursive: true });
    }

    cb(null, albumPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    );
  },
});

const uploadGallery = multer({ storage: galleryStorage, fileFilter });
//For CKEditor Upload
const uploadContentImage = multer({
  storage: makeStorage("content"),
  fileFilter,
});

module.exports = {
  uploadSlider,
  uploadPageBanner,
  uploadBlogBanner,
  uploadEventBanner,
  uploadGallery,
  uploadContentImage,
};
