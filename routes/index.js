import express from "express";
import authMiddleware from "../middleware/auth.js";
import usersRouter from "./usersRouter.js";
import contactsRouter from "./contactsRouter.js";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/api/contacts", authMiddleware, contactsRouter);

export default router;
