import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";

async function getAllContacts(req, res, next) {
  try {
    const { page = 1, limit = 10, favorite } = req.query;
    const skip = (page - 1) * limit;
    let basicParams = { owner: req.user.id };
    if (favorite) {
      basicParams.favorite = favorite;
    }

    const totalContacts = await Contact.countDocuments(basicParams);
    const contacts = await Contact.find(basicParams).limit(limit).skip(skip);

    const response = {
      totalPages: Math.ceil(totalContacts / limit),
      currentPage: page,
      totalContacts: totalContacts,
      contacts: contacts,
    };

    res.status(200).json(response);
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
