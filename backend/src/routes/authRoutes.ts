// src/routes/authRoutes.ts

import { Router } from "express";
import AuthController from "../controllers/AuthController";

const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post("/admin/login", AuthController.adminLogin);
authRouter.get("/verify-token", AuthController.verifyToken);

export default authRouter;
