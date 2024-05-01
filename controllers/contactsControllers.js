import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next({ error });
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) throw HttpError(404);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContact = await contactsService.removeContact(id);
    if (!deletedContact) throw HttpError(404);

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await contactsService.addContact(name, email, phone);

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const selectedContact = await contactsService.getContactById(id);
    if (!selectedContact) throw HttpError(404);

    if (Object.keys(req.body).length === 0) {
      return res.status(400).send("Body must have at least one field");
    }

    const newContact = {
      name: req.body.name || selectedContact.name,
      email: req.body.email || selectedContact.email,
      phone: req.body.phone || selectedContact.phone,
    };

    const contact = await contactsService.updateContact(id, newContact);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
