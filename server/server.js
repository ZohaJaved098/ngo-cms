const dotenv = require("dotenv");
const express = require("express");
const app = express();

dotenv.config();

app.get("/", (req, res) => {
  res.send("Hello World! I am from Server");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT} `);
});
