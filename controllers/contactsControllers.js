import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";

async function getAllContacts(req, res, next) {
  try {
    const contacts = await Contact.find({ owner: req.user.id }).select(
      "-createdAt -updatedAt"
    );

    res.status(200).json(contacts);
  } catch (error) {
    next({ error });
  }
}

async function getOneContact(req, res, next) {
  const { id } = req.params;
  try {
    const result = await Contact.findOne({ _id: id, owner: req.user.id });
    if (result === null) throw HttpError(404);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  const { id } = req.params;
  try {
    const result = await Contact.findOne({ _id: id, owner: req.user.id });
    if (result === null) throw HttpError(404);

    const deletedContact = await Contact.findByIdAndDelete(id);

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
    owner: req.user.id,
  };
  try {
    const newContact = await Contact.create(contact);

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  const { id } = req.params;
  try {
    const result = await Contact.findOne({ _id: id, owner: req.user.id });
    if (result === null) throw HttpError(404);

    if (Object.keys(req.body).length === 0) {
      return res.status(400).send("Body must have at least one field");
    }
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
}

async function updateStatusContact(req, res, next) {
  const { id } = req.params;
  try {
    const result = await Contact.findOne({ _id: id, owner: req.user.id });
    if (result === null) throw HttpError(404);

    const newStatusContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(newStatusContact);
  } catch (error) {
    next(error);
  }
}
export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
};
