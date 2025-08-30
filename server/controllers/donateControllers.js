const {
  WaysToDonate,
  Donation,
  DonateSettings,
} = require("../models/donateModel");
const { toArray } = require("../utils/helper");

const bannerImageUrl = (req) =>
  req.file
    ? `${req.protocol}://${req.get("host")}/uploads/ways-to-donate/${
        req.file.filename
      }`
    : undefined;

const bankIconUrl = (req, file) => {
  return `${req.protocol}://${req.get("host")}/uploads/bankIcon/${
    file.filename
  }`;
};

/* -------------------- BANNER CONTROLLERS -------------------- */
const addBannerImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Banner Image is required" });
  }
  try {
    const newBanner = new DonateSettings({
      bannerImage: bannerImageUrl(req) ?? null,
    });
    await newBanner.save();
    res.status(201).json({ message: "Banner Image created", newBanner });
  } catch (error) {
    res.status(500).json({ message: "Error adding banner Image", error });
  }
};

const viewBannerImage = async (_req, res) => {
  try {
    const bannerImage = await DonateSettings.find();
    res.status(200).json({ message: "Got banner", bannerImage });
  } catch (error) {
    res.status(500).json({ message: "Error getting banner", error });
  }
};

const editBannerImage = async (req, res) => {
  try {
    const updated = await DonateSettings.findOneAndUpdate(
      {},
      { bannerImage: bannerImageUrl(req) },
      { new: true }
    );
    res.status(200).json({ message: "Banner Image updated", updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating Banner Image", error });
  }
};

const deleteBannerImage = async (_req, res) => {
  try {
    const deleted = await DonateSettings.findOneAndDelete();
    res.status(200).json({ message: "Banner Image deleted", deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Banner Image", error });
  }
};

/* -------------------- WAYS-TO-DONATE CONTROLLERS -------------------- */
const getAllWays = async (_req, res) => {
  try {
    const waysToDonate = await WaysToDonate.find();
    res.status(200).json({ message: "Got all Ways", waysToDonate });
  } catch (error) {
    res.status(500).json({ message: "Error getting all ways", error });
  }
};

const createWay = async (req, res) => {
  try {
    const {
      bankingType,
      cause,
      causeDescription,
      accounts,
      accountsParagraph,
    } = req.body;

    let parsedAccounts = [];
    if (accounts) {
      parsedAccounts = JSON.parse(accounts).map((acc) => {
        const { _id, ...rest } = acc;
        return rest;
      });
    }

    // Pair files with accounts (by index)
    if (req.files && req.files.length > 0) {
      parsedAccounts = parsedAccounts.map((acc, i) => ({
        ...acc,
        bankIcon: req.files[i]
          ? bankIconUrl(req, req.files[i])
          : acc.bankIcon || null,
      }));
    }

    const newWay = new WaysToDonate({
      bankingType,
      cause,
      causeDescription,
      accounts: parsedAccounts,
      accountsParagraph: accountsParagraph || "",
    });

    await newWay.save();
    res.status(201).json({ message: "Way created successfully", newWay });
  } catch (err) {
    console.error("❌ Error in createWay:", err);
    res.status(500).json({ error: "Failed to create way" });
  }
};

const updateWay = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      bankingType,
      cause,
      causeDescription,
      accounts,
      accountsParagraph,
    } = req.body;

    const way = await WaysToDonate.findById(id);
    if (!way) return res.status(404).json({ error: "Way not found" });

    // parse incoming accounts (may include _id for existing ones)
    let parsedAccounts = [];
    if (accounts) {
      parsedAccounts = JSON.parse(accounts);
    }

    // Build maps for files:
    // - idFileMap: { "<acctId>" => file } for files named bankIcon-<acctId>
    // - plainFiles: [file, file, ...] for files named bankIcon (in order)
    const idFileMap = new Map();
    const plainFiles = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const match = String(file.fieldname).match(/^bankIcon-(.+)$/);
        if (match) {
          const accId = match[1];
          idFileMap.set(accId, file);
        } else if (file.fieldname === "bankIcon") {
          plainFiles.push(file);
        }
      });
    }

    // Build the updated accounts array:
    const updatedAccounts = parsedAccounts.map((acc) => {
      // acc may have _id for existing accounts, or empty/undefined for new accounts
      const accId = acc._id && String(acc._id).trim() ? String(acc._id) : null;

      // determine bankIcon URL:
      let bankIconVal = acc.bankIcon || null;

      if (accId && idFileMap.has(accId)) {
        // a file explicitly uploaded for this account
        const file = idFileMap.get(accId);
        bankIconVal = bankIconUrl(req, file);
        idFileMap.delete(accId);
      } else if (plainFiles.length > 0) {
        // consume next plain file (useful for newly-added accounts or fallback)
        const file = plainFiles.shift();
        bankIconVal = bankIconUrl(req, file);
      } else {
        // keep existing bankIcon from db if present (preserve)
        const existing = way.accounts.find(
          (a) => a._id && String(a._id) === accId
        );
        bankIconVal = existing?.bankIcon || bankIconVal || null;
      }

      // build object for mongoose subdoc; DO NOT include empty _id
      const out = {
        title: acc.title,
        IBAN: acc.IBAN,
        branch: acc.branch,
        swift: acc.swift,
        bankIcon: bankIconVal,
      };
      if (accId) out._id = accId; // include only valid ids

      return out;
    });

    // Save
    way.bankingType = bankingType;
    way.cause = cause;
    way.causeDescription = causeDescription;
    way.accounts = updatedAccounts;
    way.accountsParagraph = accountsParagraph || "";

    await way.save();

    res.json({ message: "Way updated successfully", way });
  } catch (err) {
    console.error("❌ Error in updateWay:", err);
    res.status(500).json({ error: "Failed to update way" });
  }
};

const viewWay = async (req, res) => {
  try {
    const way = await WaysToDonate.findById(req.params.id);
    if (!way) return res.status(404).json({ message: "Way not found" });
    res.status(200).json({ message: "Way fetched", way });
  } catch (error) {
    res.status(500).json({ message: "Error fetching way", error });
  }
};

const deleteWay = async (req, res) => {
  try {
    const way = await WaysToDonate.findById(req.params.id);
    if (!way) return res.status(404).json({ message: "Way not found!" });

    await WaysToDonate.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Way deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting way", error });
  }
};

/* -------------------- DONATION CONTROLLERS -------------------- */
const donatedToWay = async (req, res) => {
  const { id } = req.params;
  const { donorName, donorEmail, amount, donateStatus } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid donation amount" });
  }

  try {
    const way = await WaysToDonate.findById(id);
    if (!way) return res.status(404).json({ message: "Way not found" });

    const donation = new Donation({
      donorName: donorName || "Anonymous",
      donorEmail,
      amount,
      way: way._id,
      donateStatus,
    });

    await donation.save();
    res.status(201).json({ message: "Donation created", donation });
  } catch (error) {
    res.status(500).json({ message: "Error creating donation", error });
  }
};

const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate("way");
    res.status(200).json({ message: "Got all donations", donations });
  } catch (error) {
    res.status(500).json({ message: "Error getting all donations", error });
  }
};

const getADonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate("way");
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    res.status(200).json({ message: "A Donation fetched", donation });
  } catch (error) {
    res.status(500).json({ message: "Error fetching a donation", error });
  }
};
const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { donateStatus: status },
      { new: true }
    ).populate("way");

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({ message: "Donation status updated", donation });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};
/* -------------------- EXPORT -------------------- */
module.exports = {
  // ways
  getAllWays,
  createWay,
  viewWay,
  updateWay,
  deleteWay,
  // donations
  donatedToWay,
  getAllDonations,
  getADonation,
  updateDonationStatus,
  // banner
  addBannerImage,
  viewBannerImage,
  editBannerImage,
  deleteBannerImage,
};
