const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: { type: String },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
    },
    //Super Admin=>admin, Editor=>manager and Viewer=>user
    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
