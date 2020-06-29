const moongose = require("mongoose");
require("../models/user");
const User = moongose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");

//Saving an user
exports.singUp = (req, res) => {
  const { name, email, password, imgurl } = req.body;

  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all the fields" });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "user already exist" });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email: email,
          password: hashedPassword,
          name: name,
          pic: imgurl,
          followers: [],
          following: [],
        });

        user
          .save()
          .then(() => {
            res.json({ msg: "user saved succesfully" });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

//Auth an user
exports.singIn = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "please add all the fields" });
  }

  User.findOne({ email: email }).then((AuthUser) => {
    if (!AuthUser)
      return res.status(400).json({ error: "Invalid credentials" });

    bcrypt
      .compare(password, AuthUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: AuthUser._id }, JWT_SECRET);
          const { _id, name, email, followers, following, pic } = AuthUser;

          res.json({
            msg: "SignIn succesfully",
            token,
            user: { _id, name, email, followers, following, pic },
          });
        } else {
          return res.status(400).json({ error: "Invalid credentials" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
