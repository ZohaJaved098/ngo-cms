const dotenv = require("dotenv").config();

const express = require("express");
const dbConnect = require("./config/dbConnection");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const pageRoutes = require("./routes/pageRoutes");
const blogRoutes = require("./routes/blogRoutes");
const eventRoutes = require("./routes/eventRoutes");
const imagesRoutes = require("./routes/imagesRoutes");

// Connect to the database
dbConnect();

//create express app
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

//define port
const PORT = process.env.PORT || 5000;

//page of server
app.get("/", (req, res) => {
  res.write("Backend server is running");
  res.end();
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/images", imagesRoutes);

//start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
