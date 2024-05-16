import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";

function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (typeof authorizationHeader === "undefined") throw HttpError(401);

  const [bearer, token] = authorizationHeader.split(" ", 2);

  if (bearer !== "Bearer") throw HttpError(401, "Invalid token");

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) throw HttpError(401, "Invalid token");

    try {
      const user = await User.findById(decode.id);

      if (user === null) throw HttpError(401);
      if (user.token !== token) throw HttpError(401);
    } catch (error) {
      next(error);
    }

    req.user = {
      id: decode.id,
      email: decode.email,
    };

    next();
  });
}

export default auth;
