const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const moongose = require("mongoose");
const User = moongose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "You must be logIn" });
  }
  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, JWT_SECRET, (error, payload) => {
    if (error) {
      return res.status(401).json({ error: "You must be logIn" });
    }

    const { _id } = payload;

    User.findById(_id).then((userData) => {
      req.user = userData;
      next();
    });
  });
};
