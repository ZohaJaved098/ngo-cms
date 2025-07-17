const mongoose = require("mongoose");
const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_DB);
    console.log(
      `Database connected successfully: ${connect.connection.host}, ${connect.connection.name}`
    );
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
module.exports = dbConnect;
