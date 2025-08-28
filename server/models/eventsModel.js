const mongoose = require("mongoose");

const RegisteredUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const EventsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    typeOfEvent: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    guestSpeakers: [
      {
        type: String,
        required: true,
      },
    ],
    typeOfVenue: {
      type: String,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "ongoing", "cancelled"],
      required: true,
    },
    registeredUsers: [RegisteredUserSchema],
    coverImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", EventsSchema);
