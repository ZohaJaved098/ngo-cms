// middlewares/uploadMiddleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// helper
function ensureFolder(folder) {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
}

function makeStorage(folderName) {
  const uploadPath = path.join(process.cwd(), "uploads", folderName);
  ensureFolder(uploadPath);
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) =>
      cb(
        null,
        Date.now() + "-" + file.fieldname + path.extname(file.originalname)
      ),
  });
}

// filters
const imageFileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error("Only JPEG, PNG, or WebP images are allowed!"));
};

const docFileFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx|xls|xlsx|ppt|pptx/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error("Only PDF, Word, Excel, or PPT files are allowed!"));
};

// single-purpose uploaders (keep for other routes)
const uploadSlider = multer({
  storage: makeStorage("sliders"),
  fileFilter: imageFileFilter,
});
const uploadPageBanner = multer({
  storage: makeStorage("pages"),
  fileFilter: imageFileFilter,
});
const uploadBlogBanner = multer({
  storage: makeStorage("blogs"),
  fileFilter: imageFileFilter,
});
const uploadEventBanner = multer({
  storage: makeStorage("events"),
  fileFilter: imageFileFilter,
});
const uploadDocument = multer({
  storage: makeStorage("documents"),
  fileFilter: docFileFilter,
});
const uploadBankIcon = multer({
  storage: makeStorage("bankIcon"),
  fileFilter: imageFileFilter,
});
const uploadWaysBanner = multer({
  storage: makeStorage("ways-to-donate"),
  fileFilter: imageFileFilter,
});

// gallery uploader (unchanged)
const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const albumTitle = req.body.albumTitle || "uncategorized";
    const albumPath = path.join(
      process.cwd(),
      "uploads",
      "galleries",
      albumTitle
    );
    ensureFolder(albumPath);
    cb(null, albumPath);
  },
  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    ),
});
const uploadGallery = multer({
  storage: galleryStorage,
  fileFilter: imageFileFilter,
});

// content images
const uploadContentImage = multer({
  storage: makeStorage("content"),
  fileFilter: imageFileFilter,
});

const combinedStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "others";
    if (file.fieldname === "bannerImage") folder = "pages";
    else if (file.fieldname === "file") folder = "documents";
    const uploadPath = path.join(process.cwd(), "uploads", folder);
    ensureFolder(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    );
  },
});

const combinedFileFilter = (req, file, cb) => {
  if (file.fieldname === "bannerImage") return imageFileFilter(req, file, cb);
  if (file.fieldname === "file") return docFileFilter(req, file, cb);
  cb(null, true);
};

const uploadBannerAndFile = multer({
  storage: combinedStorage,
  fileFilter: combinedFileFilter,
}).fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

module.exports = {
  uploadSlider,
  uploadPageBanner,
  uploadBlogBanner,
  uploadEventBanner,
  uploadGallery,
  uploadContentImage,
  uploadDocument,
  uploadBankIcon,
  uploadBannerAndFile,
  uploadWaysBanner,
};
