import express from "express";
import UserController from "../controllers/usersControllers.js";
import {
  authUserSchema,
  updateSubscriptionSchema,
  emailSchema,
} from "../models/user.js";
import validateBody from "../helpers/validateBody.js";
import authMiddleware from "../middleware/auth.js";
import uploadMiddleware from "../middleware/upload.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validateBody(authUserSchema),
  UserController.register
);
usersRouter.post("/login", validateBody(authUserSchema), UserController.login);
usersRouter.post("/logout", authMiddleware, UserController.logout);
usersRouter.get("/current", authMiddleware, UserController.getCurrentUser);
usersRouter.patch(
  "/",
  authMiddleware,
  validateBody(updateSubscriptionSchema),
  UserController.updateSubscription
);
usersRouter.get("/avatars", authMiddleware, UserController.getAvatar);
usersRouter.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  UserController.uploadAvatar
);
usersRouter.get("/verify/:verificationToken", UserController.verify);
usersRouter.post(
  "/verify",
  validateBody(emailSchema),
  UserController.resendVerifyEmail
);

export default usersRouter;
