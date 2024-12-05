// src/controllers/AuthController.ts

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/User";
import { IUser } from "../types/IUser";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "hello";

class AuthController {
  private static readonly ADMIN = {
    email: "admin@gmail.com",
    password: "123456",
  };

  public async adminLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log(req.body);

      if (
        email !== AuthController.ADMIN.email ||
        password !== AuthController.ADMIN.password
      ) {
        res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
        return;
      }

      const token = jwt.sign({ role: "admin" }, "secret_key", {
        expiresIn: "1h",
      });

      res.json({
        success: true,
        message: "Admin login successful",
        admin: { email },
        token,
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

  // User Registration
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      console.log(req.body);

      if (!username || !email || !password) {
        res
          .status(400)
          .json({ success: false, message: "All fields are required" });
        return;
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        res
          .status(400)
          .json({ success: false, message: "Email already in use" });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();

      const token = jwt.sign(
        { userId: savedUser._id, email: savedUser.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          username: savedUser.username,
          email: savedUser.email,
          id: savedUser._id,
          profileImage: savedUser.profileImage,
        },
        token,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message); // Log the error for debugging
        res.status(500).json({ success: false, message: error.message });
      } else {
        res
          .status(500)
          .json({ success: false, message: "An unknown error occurred." });
      }
    }
  }

  // User Login
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
        return;
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({
        success: true,
        message: "Login successful",
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
          profileImage: user.profileImage,
        },
        token,
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

  // Verify Token
  public async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header("Authorization")?.split(" ")[1];
      if (!token) {
        res.status(401).json({ success: false, message: "No token provided" });
        return;
      }

      jwt.verify(token, "secret_key", (err, decoded) => {
        if (err) {
          res
            .status(403)
            .json({ success: false, message: "Failed to authenticate token" });
          return;
        }

        res
          .status(200)
          .json({ success: true, message: "Token is valid", decoded });
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
}

export default new AuthController();
