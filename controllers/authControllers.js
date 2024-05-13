import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";

async function register(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user !== null) throw HttpError(409, "Email in use");

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await User.create({ email, password: passwordHash });

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

    res.send({ token: "Token" });
  } catch (error) {
    next(error);
  }
}

export default {
  register,
  login,
};
