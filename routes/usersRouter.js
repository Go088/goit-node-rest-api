import express from "express";
import UserController from "../controllers/usersControllers.js";
import { authUserSchema } from "../models/user.js";
import validateBody from "../helpers/validateBody.js";
import authMiddleware from "../middleware/auth.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validateBody(authUserSchema),
  UserController.register
);
usersRouter.post("/login", validateBody(authUserSchema), UserController.login);
usersRouter.post("/logout", authMiddleware, UserController.logout);
usersRouter.get("/current", authMiddleware, UserController.getCurrentUser);

export default usersRouter;
