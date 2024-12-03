// src/controllers/UserController.ts

import { Request, Response } from "express";
import UserModel from "../models/User";
import bcrypt from "bcryptjs";
import { IUser } from "../types/IUser";

class UserController {
  // Get all Users
  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserModel.find();
      res.status(200).json({ success: true, users });
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
}

export default new UserController();
