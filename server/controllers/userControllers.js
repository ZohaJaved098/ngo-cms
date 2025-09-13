const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const profilePicUrl = (req) =>
  req.file
    ? `${req.protocol}://${req.get("host")}/uploads/profilePic/${
        req.file.filename
      }`
    : undefined;

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
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);

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
    let profilePic = "";
    if (req.file) {
      profilePic = profilePicUrl(req);
    } else {
      const seed = encodeURIComponent(username || Date.now().toString());
      profilePic = `https://api.dicebear.com/6.x/avataaars/png?seed=${seed}`;
    }
    const newUser = await User.create({
      username,
      email,
      role: "admin",
      password: hashedPassword,
      profilePic,
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
const updateUser = async (req, res) => {
  const { username } = req.body;
  try {
    if (req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this profile" });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.username = username || user.username;
    if (req.file) user.profilePic = profilePicUrl(req);
    await user.save();
    res.status(200).json({ message: "User info updated", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", err });
  }
};

module.exports = {
  getAllUsers,
  getAUser,
  deleteUser,
  updateUserRole,
  createNewUser,
  updateUser,
};
