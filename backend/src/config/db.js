const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");
  } catch (err) {
    console.log("DB connection failed", err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
