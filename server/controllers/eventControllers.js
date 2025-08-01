const Event = require("../models/eventsModel");

//all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ message: `All Events are`, events });
  } catch (error) {
    res.status(500).json({ message: "Error getting all Events", error });
  }
};
//create event
const createEvent = async (req, res) => {
  const {
    name,
    typeOfEvent,
    description,
    guestSpeakers,
    typeOfVenue,
    location,
    registered,
    status,
  } = req.body;
  const errors = {};
  try {
    if (!name) {
      errors.name = "Name is required";
    }
    if (!typeOfEvent) {
      errors.typeOfEvent = "Event type is required";
    }

    if (!description) {
      errors.description = "Description is required";
    }

    if (!Array.isArray(guestSpeakers) || guestSpeakers.length === 0) {
      errors.guestSpeakers = "Guest Speakers are required";
    }

    if (!typeOfVenue) {
      errors.typeOfVenue = "Vanue Type is required";
    }
    if (!location) {
      errors.location = "Location is required";
    }

    if (Object.keys(errors).length > 0) {
      return res
        .status(400)
        .json({ message: `Error Creating Events!`, errors: errors });
    }
    //if no errors proceed
    const newEvent = new Event({
      name,
      typeOfEvent,
      description,
      guestSpeakers,
      typeOfVenue,
      location,
      registered,
      status,
    });
    await newEvent.save();
    res.status(201).json({
      message: `New Event created successfully with title: ${newEvent.name} `,
      newEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating new Event",
      error,
    });
  }
};
const viewEvent = async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: `Event not found!` });

    res.status(200).json({
      message: "Event info",
      event,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching one Event of id ${eventId}`, error });
  }
};

const updateEvent = async (req, res) => {
  const errors = {};
  try {
    const eventId = req.params.id;
    const {
      name,
      typeOfEvent,
      description,
      guestSpeakers,
      typeOfVenue,
      location,
      registered,
      status,
    } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: `Event not found!` });

    await Event.findByIdAndUpdate(
      eventId,
      {
        name,
        typeOfEvent,
        description,
        guestSpeakers,
        typeOfVenue,
        location,
        registered,
        status,
      },
      { new: true }
    );
    res.status(200).json({ message: `Event updated` });
  } catch (error) {
    res.status(500).json({ message: `error Updating Event ` });
  }
};
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: `Event not found!` });

    await Event.findByIdAndDelete(eventId);

    res.status(200).json({ message: `Event Deleted` });
  } catch (error) {
    res.status(500).json({ message: `Error deleting Event`, error });
  }
};

module.exports = {
  getEvents,
  createEvent,
  viewEvent,
  updateEvent,
  deleteEvent,
};
