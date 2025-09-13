const Contact = require("../models/contactModel.js");
const contactIconUrl = (req) =>
  req.file
    ? `${req.protocol}://${req.get("host")}/uploads/contactIcon/${
        req.file.filename
      }`
    : undefined;

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json({ contacts });
  } catch (err) {
    res.status(500).json({ message: "Error fetching contacts", err });
  }
};
const getAContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    res.json({ contact });
  } catch (err) {
    res.status(500).json({ message: "Error fetching contact", err });
  }
};

const addContact = async (req, res) => {
  try {
    const { type, value } = req.body;

    const contact = await Contact.create({
      type,
      value,
      contactIcon: contactIconUrl(req) ?? null,
    });
    res.status(201).json({ message: "Contact added", contact });
  } catch (err) {
    res.status(500).json({ message: "Error adding contact", err });
  }
};

const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting contact", err });
  }
};
const updateContact = async (req, res) => {
  try {
    const { type, value } = req.body;
    const newContactIcon = contactIconUrl(req);
    const update = {
      type,
      value,
    };
    if (newContactIcon) update.contactIcon = newContactIcon;

    const updated = await Contact.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    res.status(200).json({ message: "updated contact", updated });
  } catch (error) {
    res.status(500).json({ message: "Error Updating contact", err });
  }
};

module.exports = {
  deleteContact,
  getContacts,
  addContact,
  updateContact,
  getAContact,
};
