import { Router } from "express";
import userController from "../controllers/UserController";

const userRouter = Router();

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

export default userRouter;
