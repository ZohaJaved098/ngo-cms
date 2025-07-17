const dotenv = require("dotenv").config();
const express = require("express");
const dbConnect = require("./config/dbConnection");

// Connect to the database
dbConnect();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

//start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} `);
});
