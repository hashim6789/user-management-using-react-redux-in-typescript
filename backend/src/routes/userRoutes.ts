import { Router } from "express";
import userController from "../controllers/UserController";
import multer from "multer";

const userRouter = Router();

const upload = multer();

userRouter.get(
  "/",
  //  isAdmin,
  userController.getUsers
);
userRouter.get(
  "/:id",
  //  isAuthenticated,
  userController.getUserById
);
userRouter.post(
  "/",
  // isAdmin,
  userController.createUser
);
userRouter.put(
  "/:id",
  // isAdmin,
  userController.updateUser
);
userRouter.delete(
  "/:id",
  // isAdmin,
  userController.deleteUser
);

userRouter.put(
  "/:id/upload-image",
  upload.single("profileImage"),
  userController.uploadProfileImage
);

export default userRouter;
