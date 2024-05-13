import express from "express";

import authRouter from "./authRouter.js";
import contactsRouter from "./contactsRouter.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/api/contacts", authMiddleware, contactsRouter);

export default router;
