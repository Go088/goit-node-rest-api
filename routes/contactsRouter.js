import express from "express";
import isValidId from "../helpers/isValidId.js";
import validateBody from "../helpers/validateBody.js";
import ContactController from "../controllers/contactsControllers.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../models/contact.js";

const contactsRouter = express.Router();

contactsRouter.get("/", ContactController.getAllContacts);

contactsRouter.get("/:id", isValidId, ContactController.getOneContact);

contactsRouter.delete("/:id", isValidId, ContactController.deleteContact);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  ContactController.createContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(updateContactSchema),
  ContactController.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateFavoriteSchema),
  ContactController.updateStatusContact
);

export default contactsRouter;
