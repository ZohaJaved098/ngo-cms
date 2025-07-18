const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: `User with email ${existingUser.email} already registered`,
      });
    }
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({
      message: `User Registered successfully with email: ${newUser.email} `,
      newUser: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error registering new user, ${error}`,
    });
  }
};

//Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ${user.email} doesn't exist!` });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: `Invalid Credentials!!` });
    }
    //upon success generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    //save token to cookie
    res
      .cookie("access-token", token, { httpOnly: true })
      .status(200)
      .json({ message: `User successfully Logged in.`, token });
  } catch (error) {
    res.status(500).json({ message: `Error log in user ${error} ` });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
