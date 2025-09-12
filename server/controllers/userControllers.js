const User = require("../models/userModel");
const bcrypt = require("bcrypt");
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
const getAUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ message: `A user is fetched`, user });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching user`, error: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    res.status(200).json({ message: `Users Deleted`, deletedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching users`, error: error.message });
  }
};
const createNewUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ message: `User with email${email} already exist` });

    if (!username || !email || !password)
      return res
        .status(400)
        .json({ message: "Username, Email and Password required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      role: "admin",
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "New Admin created", newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating new admin", error });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    res.status(200).json({
      message: "User role updated successfully",
      updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating role", error: error.message });
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
  getAUser,
  deleteUser,
  updateUserRole,
  createNewUser,
};
