import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import mongoose from "mongoose";
import { error, log } from "node:console";

const DB_URI = `mongodb+srv://Arthur:XLDkII1EYunkbcBa@cluster0.89yytgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

async function run() {
  try {
    await mongoose.connect(DB_URI);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((error) => console.log(error));

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

function writeContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await readContacts();
  const result = contacts.find((item) => item.id === contactId);
  return result || null;
}

async function removeContact(contactId) {
  const contacts = await readContacts();
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  const result = contacts[index];

  const newListContacts = [
    ...contacts.slice(0, index),
    ...contacts.slice(index + 1),
  ];
  await writeContacts(newListContacts);
  return result;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}

async function updateContact(id, updateData) {
  const contacts = await readContacts();
  const index = contacts.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }
  const updateContact = { id, ...updateData };
  const newListContacts = [
    ...contacts.slice(0, index),
    updateContact,
    ...contacts.slice(index + 1),
  ];

  await writeContacts(newListContacts);
  return updateContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
