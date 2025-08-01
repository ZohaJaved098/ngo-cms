const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
const emailRegex = /\S+@\S+\.\S+/;

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, role } = req.body;
    const errors = {};
    //validate username
    if (!username) {
      errors.username = "Name is required";
    }
    //validate email
    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Email is invalid";
    }
    //validate password
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (password.length > 30) {
      errors.password = "Password must be at most 30 characters long";
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    if (password != confirmPassword) {
      errors.confirmPassword = "Password is not same!";
    }

    //validate role
    if (!role) {
      errors.role = "Role is required";
    }

    //if user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.existingUser = "User already exists";
      return res.status(400).json({
        message: `User with email ${existingUser.email} already registered`,
      });
    }

    // If there are validation errors, do not proceed with the form submission
    if (Object.keys(errors).length > 0) {
      return res
        .status(400)
        .json({ message: `Error Registering!`, errors: errors });
    }

    //if no errors proceed
    const hashedPassword = await bcrypt.hash(password, 5);

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

    const errors = {};
    //validate email
    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Email is invalid";
    }
    //validate password
    if (!password) {
      errors.password = "Password is required";
    }
    // If there are validation errors, do not proceed with the form submission
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: `Error Login!`, errors: errors });
    }

    const user = await User.findOne({ email });
    //if user don't exist
    if (!user) {
      return res.status(404).json({
        message: `User with ${email} doesn't exist!`,
        errors: { email: "User not found" },
      });
    }

    //match current pw with pw stored in db
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: `Invalid Credentials!!`,
        errors: { password: "Incorrect password" },
      });
    }

    //upon success generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
      // { expiresIn: "3h" }
    );

    //save token to cookie
    res
      .cookie("access-token", token, {
        httpOnly: true,
        // maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
        secure: false,
        sameSite: "lax",
      })
      .status(200)
      .json({ message: `User successfully Logged in.`, token, user: user });
  } catch (error) {
    res.status(500).json({ message: `Error log in user ${error} ` });
  }
};

const logoutUser = (req, res) => {
  try {
    res
      .clearCookie("access-token")
      .status(200)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: `Error logging out user ${error}` });
  }
};

// const getMe = async (req, res) => {
//   try {
//     const token = req.cookies["access-token"];
//     if (!token) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ user });
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token", err });
//   }
// };

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  // getMe,
};
