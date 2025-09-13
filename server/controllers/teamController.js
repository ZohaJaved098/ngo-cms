const TeamMember = require("../models/teamModel.js");
const memberPicUrl = (req) =>
  req.file
    ? `${req.protocol}://${req.get("host")}/uploads/memberPic/${
        req.file.filename
      }`
    : undefined;
const getAllTeam = async (req, res) => {
  try {
    const team = await TeamMember.find();
    res.json({ team });
  } catch (err) {
    res.status(500).json({ message: "Error fetching team", err });
  }
};
const getATeam = async (req, res) => {
  try {
    const team = await TeamMember.findById(req.params.id);
    res.json({ team });
  } catch (err) {
    res.status(500).json({ message: "Error fetching team", err });
  }
};

const createTeamMember = async (req, res) => {
  try {
    const { name, role } = req.body;
    let memberPic = "";
    if (req.file) {
      memberPic = memberPicUrl(req);
    } else {
      const seed = encodeURIComponent(name || role || Date.now().toString());
      memberPic = `https://api.dicebear.com/6.x/avataaars/png?seed=${seed}`;
    }

    const member = await TeamMember.create({ name, role, memberPic });
    res.status(201).json({ message: "Team member added", member });
  } catch (err) {
    res.status(500).json({ message: "Error adding team member", err });
  }
};

const updateTeam = async (req, res) => {
  const { name, role } = req.body;
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.name = name || member.name;
    member.role = role || member.role;

    if (req.file) {
      member.memberPic = memberPicUrl(req);
    }
    await member.save();
    res.status(200).json({ message: "Team member updated", member });
  } catch (err) {
    res.status(500).json({ message: "Error updating team member", err });
  }
};
const deleteTeamMember = async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: "Team member removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting team member", err });
  }
};
module.exports = {
  deleteTeamMember,
  getAllTeam,
  createTeamMember,
  getATeam,
  updateTeam,
};
