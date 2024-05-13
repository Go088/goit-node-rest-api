import express from "express";
import AuthController from "../controllers/authControllers.js";
import { authUserSchema } from "../models/user.js";
import validateBody from "../helpers/validateBody.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(authUserSchema),
  AuthController.register
);
authRouter.post("/login", validateBody(authUserSchema), AuthController.login);

export default authRouter;
