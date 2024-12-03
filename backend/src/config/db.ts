import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING as string);
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("MongoDB connection failed", err);
    process.exit(1); // Exit the process if connection fails
  }
};
