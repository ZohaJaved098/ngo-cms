const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  bankIcon: String,
  title: { type: String },
  IBAN: { type: String },
  branch: String,
  swift: String,
});

const WaysToDonateSchema = new mongoose.Schema(
  {
    bankingType: {
      type: String,
      enum: [
        "online_banking",
        "bank_transfer",
        "home_collection",
        "international",
      ],
      required: true,
    },
    cause: {
      type: String,
      required: true,
    },
    causeDescription: String,
    accounts: [AccountSchema],
    accountsParagraph: String,
  },
  { timestamps: true }
);

const DonationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      default: "Anonymous",
    },
    donorEmail: String,

    amount: {
      type: Number,
      required: true,
    },

    way: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WaysToDonate",
      required: true,
    },
    donateStatus: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const DonateSettingsSchema = new mongoose.Schema({
  bannerImage: String,
});

const WaysToDonate = mongoose.model("WaysToDonate", WaysToDonateSchema);
const Donation = mongoose.model("Donation", DonationSchema);
const DonateSettings = mongoose.model("DonateSettings", DonateSettingsSchema);
module.exports = { WaysToDonate, Donation, DonateSettings };
