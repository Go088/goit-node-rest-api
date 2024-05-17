import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

async function register(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user !== null) throw HttpError(409, "Email in use");

    const passwordHash = await bcrypt.hash(password, 10);
    const avatar = gravatar.url(email);

    const result = await User.create({
      email,
      password: passwordHash,
      avatarURL: avatar,
    });

    res.status(201).json({
      user: { email: result.email, subscription: result.subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user === null) throw HttpError(401, "Email or password is wrong");

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      throw HttpError(401, "Email or password is wrong");
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "23h" }
    );

    await User.findByIdAndUpdate(user._id, { token });

    res.send({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function getCurrentUser(req, res, next) {
  const { id } = req.user;
  try {
    const result = await User.findById(id);
    const { email, subscription } = result;

    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
}
async function updateSubscription(req, res, next) {
  const { id } = req.user;
  try {
    const result = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function uploadAvatar(req, res, next) {
  try {
    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );
    const avatarURL = `http://localhost:3000/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: avatarURL },
      { new: true }
    );

    res.status(200).json(user.avatarURL);
  } catch (error) {
    next(error);
  }
}

async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (user.avatarURL === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }
    res.status(200).json(path.resolve("public/avatars", user.avatarURL));
  } catch (error) {
    next(error);
  }
}

export default {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  uploadAvatar,
  getAvatar,
};
