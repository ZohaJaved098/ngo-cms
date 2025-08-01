const mongoose = require("mongoose");

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
    //array of guest speakers could be more than 1 guests
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
    location: {
      type: String,
      required: true,
    },
    //registered accounts number and and their details
    registered: {
      type: String,
    },
    status: {
      type: String,
      enum: ["completed", "ongoing", "cancelled"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Events", EventsSchema);
