const Volunteer = require("../models/volunteerModel");

const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json({ volunteers });
  } catch (err) {
    res.status(500).json({ message: "Error fetching volunteers", err });
  }
};

const applyVolunteer = async (req, res) => {
  try {
    const { name, email, motivation } = req.body;
    const application = await Volunteer.create({
      name,
      email,
      motivation,
      status: "pending",
    });
    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    res.status(500).json({ message: "Error applying", err });
  }
};

const updateVolunteerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: "Volunteer status updated", volunteer });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", err });
  }
};

const deleteVolunteer = async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ message: "Volunteer removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting volunteer", err });
  }
};
module.exports = {
  deleteVolunteer,
  getVolunteers,
  applyVolunteer,
  updateVolunteerStatus,
};
