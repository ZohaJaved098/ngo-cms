const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  type: { type: String, enum: ["email", "phone", "social"], required: true },
  value: { type: String },
  contactIcon: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contact", contactSchema);
