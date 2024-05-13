import express from "express";

import authRouter from "./authRouter.js";
import contactsRouter from "./contactsRouter.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/api/contacts", contactsRouter);

export default router;
