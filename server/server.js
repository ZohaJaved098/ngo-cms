const dotenv = require("dotenv").config();
const express = require("express");
const dbConnect = require("./config/dbConnection");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Connect to the database
dbConnect();

//create express app
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

//start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
