const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

const {
  singUp,
  singIn,
  resetPassword,
  newPassword,
  sendmessague,
} = authController;

router.post("/signup", singUp);

router.post("/signin", singIn);

router.post("/reset-password", resetPassword);

router.post("/new-password", newPassword);

module.exports = router;
