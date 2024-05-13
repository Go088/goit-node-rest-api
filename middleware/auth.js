import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";

function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (typeof authorizationHeader === "undefined") throw HttpError(401);

  const [bearer, token] = authorizationHeader.split(" ", 2);
  console.log({ bearer, token });

  if (bearer !== "Bearer") throw HttpError(401, "Invalid token");

  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) throw HttpError(401, "Invalid token");

    console.log({ decode });

    next();
  });
}

export default auth;
