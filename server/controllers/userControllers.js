const User = require("../models/userModel");
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: `All users are fetched`, users: users });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching users`, error: error.message });
  }
};

const adminAccess = (req, res) => {
  res.json({ message: `Only admin can access this` });
};
const managerAccess = (req, res) => {
  res.json({ message: `Manager and Admin can access this` });
};
const userAccess = (req, res) => {
  res.json({ message: `All can access this` });
};

module.exports = {
  getAllUsers,
  adminAccess,
  managerAccess,
  userAccess,
};
