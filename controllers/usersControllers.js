import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import mail from "../helpers/mail.js";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";

async function register(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user !== null) throw HttpError(409, "Email in use");

    const passwordHash = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomUUID();
    const avatar = gravatar.url(email);

    const result = await User.create({
      email,
      password: passwordHash,
      avatarURL: avatar,
      verifyToken,
    });

    await mail.sendMail({
      to: email,
      from: "tapkharov@gmail.com",
      subject: "Verify your email",
      html: `To confirm your email please click on the <a href="http://localhost:3000/users/verify/${verifyToken}">link </a>`,
      text: `To confirm your email please open the link http://localhost:3000/users/verify/${verifyToken}`,
    });

    res.status(200).json({
      message: "Verification email send",
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

    if (user.verify === false)
      return res.status(401).send({ message: "Please verify your email" });

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
    const inputPath = req.file.path;
    const filename = req.file.filename;
    const newPath = path.resolve("public/avatars", filename);

    const image = await Jimp.read(inputPath);
    await image.resize(250, Jimp.AUTO).writeAsync(inputPath);

    await fs.rename(inputPath, newPath);

    const avatarURL = `http://localhost:3000/avatars/${filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: avatarURL },
      { new: true }
    );

    res.status(200).json({ avatarURL: avatarURL });
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

async function verify(req, res, next) {
  const { verificationToken } = req.params;
  try {
    const user = await User.findOne({ verifyToken: verificationToken });

    if (user === null) throw HttpError(404, "User not found");

    await User.findByIdAndUpdate(user._id, { verify: true, verifyToken: null });

    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
}

async function resendVerifyEmail(req, res, next) {
  const { email } = req.email;
  try {
    const user = User.findOne({ email });
    if (user === null) throw HttpError(404, "User not found");
    if (user.verify)
      throw HttpError(400, "Verification has already been passed");

    await mail.sendMail({
      to: email,
      from: "tapkharov@gmail.com",
      subject: "Verify your email",
      html: `To confirm your email please click on the <a href="http://localhost:3000/users/verify/${user.verifyToken}">link </a>`,
      text: `To confirm your email please open the link http://localhost:3000/users/verify/${user.verifyToken}`,
    });

    res.status(200).json({
      message: "Verification email sent",
    });
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
  verify,
  resendVerifyEmail,
};
