require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongodb");
  } catch (error) {
    console.log("connection error", error);
  }
};
module.exports=connectDB
