const moongose = require("mongoose");
require("../models/user");
const User = moongose.model("User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { use } = require("../routes/auth");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

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
          .then((user) => {
            res.json({ msg: "user saved succesfully" });
            transporter.sendMail({
              to: user.email,
              from: "pruebin123@yopmail.com",
              subject: "SignUp Success",
              html:
                "<div><h1>Welcome to the InstaClone</h1><h6> made by Jhon</h6></div>",
            });
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

exports.resetPassword = (req, res) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) return console.log(error);

    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) return res.status(422).json({ error: "User doesn't exist" });
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: result.email,
          from: "pruebin123@yopmail.com",
          subject: "Reset Password",
          html: `
            <p>To reset your password press the link below</p>
           <h3><a href="http://localhost:3000/reset/${token}">Here is the link</a></h3>
          `,
        });
      });
      res.json({ msg: "Check your email" });
    });
  });
};

exports.newPassword = (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;

  User.findOne({
    resetToken: sentToken,
    expireToken: { $gt: Date.now() },
  }).then((user) => {
    if (!user) return res.status(422).json({ msg: "Token has expired" });

    bcrypt
      .hash(newPassword, 12)
      .then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then(() => {
          res.json({ msg: "Password has been updated successfully" });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
