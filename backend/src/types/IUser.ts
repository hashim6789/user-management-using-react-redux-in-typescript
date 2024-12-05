import { Document } from "mongoose";

// Define the User interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profileImage: string;
  profileImagePublicId: string;
}
