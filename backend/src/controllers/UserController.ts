// src/controllers/UserController.ts

import { Request, Response } from "express";
import UserModel from "../models/User";
import bcrypt from "bcryptjs";
import { IUser } from "../types/IUser";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary";

class UserController {
  // Get all Users
  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserModel.find();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res
          .status(500)
          .json({ success: false, message: "An unknown error occurred." });
      }
    }
  }

  // Get User by ID
  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      res.status(200).json({ success: true, user });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res
          .status(500)
          .json({ success: false, message: "An unknown error occurred." });
      }
    }
  }

  // Create new User
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;
      console.log(req.body);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();

      if (savedUser) {
        res.status(201).json({
          success: true,
          message: "User created successfully",
          user: savedUser,
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Error creating user" });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res
          .status(500)
          .json({ success: false, message: "An unknown error occurred." });
      }
    }
  }

  // Update User by ID
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedUser) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res
          .status(500)
          .json({ success: false, message: "An unknown error occurred." });
      }
    }
  }

  // Delete User by ID
  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

      if (!deletedUser) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res
          .status(500)
          .json({ success: false, message: "An unknown error occurred." });
      }
    }
  }

  public async uploadProfileImage(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    console.log("userId", userId);

    try {
      // Validate file
      if (!req.file) {
        res.status(400).json({ message: "No image file provided" });
        return;
      }

      // Check if user exists
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Delete existing image from Cloudinary if exists
      if (user.profileImagePublicId) {
        try {
          await deleteImageFromCloudinary(user.profileImagePublicId);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      // Upload new image to Cloudinary
      const uploadResult = await uploadImageToCloudinary(
        req.file.buffer,
        "profile-images"
      );

      // Update user's profile image
      user.profileImage = uploadResult.secure_url;
      user.profileImagePublicId = uploadResult.public_id;
      await user.save();

      res
        .status(200)
        .json({
          message: "Profile image updated successfully",
          user: {
            profileImage: user.profileImage,
            username: user.username,
            email: user.email,
            id: user._id,
          },
        });
    } catch (error) {
      console.error("Error uploading profile image:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new UserController();
