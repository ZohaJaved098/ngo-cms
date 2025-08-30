const express = require("express");
const router = express.Router();
const {
  getAllWays,
  createWay,
  updateWay,
  viewWay,
  donatedToWay,
  deleteWay,
  getADonation,
  getAllDonations,
  updateDonationStatus,
  addBannerImage,
  viewBannerImage,
  editBannerImage,
  deleteBannerImage,
} = require("../controllers/donateControllers");

const authorizedRoles = require("../middlewares/roleMiddleware");
const verifyToken = require("../middlewares/authMiddleware");
const {
  uploadBankIcon,
  uploadWaysBanner,
} = require("../middlewares/uploadMiddleware");
//public
router.get("/all-ways", getAllWays);

//banner image
router.get("/banner", viewBannerImage);
router.post(
  "/add-banner",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadWaysBanner.single("bannerImage"),
  addBannerImage
);
router.put(
  "/edit-banner",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadWaysBanner.single("bannerImage"),
  editBannerImage
);
router.delete(
  "/banner",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deleteBannerImage
);
//ways to donate
router.post(
  "/create",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadBankIcon.array("bankIcon"),
  createWay
);

router.post("/donated/:id", donatedToWay);
router.get("/donated/:id", getADonation);
router.get("/donated", getAllDonations);
router.patch("/donated/:id/status", updateDonationStatus);

router.get("/:id", viewWay);
router.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  uploadBankIcon.any(),
  updateWay
);

router.delete(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "manager"),
  deleteWay
);

module.exports = router;
