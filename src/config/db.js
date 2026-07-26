import mongoose from "mongoose";
import getEnvVariables from "../environment/env.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(getEnvVariables().mongo_uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
