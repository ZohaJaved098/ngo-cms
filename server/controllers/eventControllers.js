const Event = require("../models/eventsModel");

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ message: "All Events fetched", events });
  } catch (error) {
    res.status(500).json({ message: "Error getting all Events", error });
  }
};

// Create event
const createEvent = async (req, res) => {
  const {
    name,
    typeOfEvent,
    description,
    guestSpeakers,
    typeOfVenue,
    location,
    eventDate,
    status,
    coverImage, // optional
  } = req.body;

  const errors = {};

  if (!name) errors.name = "Name is required";
  if (!typeOfEvent) errors.typeOfEvent = "Event type is required";
  if (!description) errors.description = "Description is required";
  if (!Array.isArray(guestSpeakers) || guestSpeakers.length === 0)
    errors.guestSpeakers = "At least one guest speaker is required";
  if (!typeOfVenue) errors.typeOfVenue = "Venue Type is required";
  if (!location) errors.location = "Location is required";
  if (!eventDate) errors.eventDate = "Event date & time is required";
  if (!status) errors.status = "Event status is required";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Error Creating Event", errors });
  }

  try {
    const newEvent = new Event({
      name,
      typeOfEvent,
      description,
      guestSpeakers,
      typeOfVenue,
      location,
      eventDate,
      status,
      coverImage,
      registeredUsers: [],
    });

    await newEvent.save();

    res.status(201).json({
      message: `Event "${newEvent.name}" created successfully`,
      newEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating new Event",
      error,
    });
  }
};

// View single event
const viewEvent = async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found!" });

    res.status(200).json({
      message: "Event info fetched",
      event,
    });
  } catch (error) {
    res.status(500).json({ message: `Error fetching event`, error });
  }
};

// Update event
const updateEvent = async (req, res) => {
  const eventId = req.params.id;
  const {
    name,
    typeOfEvent,
    description,
    guestSpeakers,
    typeOfVenue,
    location,
    eventDate,
    status,
    coverImage,
  } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found!" });

    const updated = await Event.findByIdAndUpdate(
      eventId,
      {
        name,
        typeOfEvent,
        description,
        guestSpeakers,
        typeOfVenue,
        location,
        eventDate,
        status,
        coverImage,
      },
      { new: true }
    );

    res.status(200).json({ message: "Event updated", updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating Event", error });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found!" });

    await Event.findByIdAndDelete(eventId);

    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Event", error });
  }
};
// Register a user to an event
const registerUserToEvent = async (req, res) => {
  const { id } = req.params;
  const { name, email, occupation, reason } = req.body;

  if (!name || !email || !occupation || !reason) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.registeredUsers.push({ name, email, occupation, reason });
    await event.save();

    res.status(200).json({ message: "Successfully registered for the event!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

module.exports = {
  getEvents,
  createEvent,
  viewEvent,
  updateEvent,
  deleteEvent,
  registerUserToEvent,
};
