import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/IUser"; // Import the IUser interface

// Define the user schema
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
  profileImagePublicId: {
    type: String,
    default: "",
  },
});

// Create and export the User model
const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
