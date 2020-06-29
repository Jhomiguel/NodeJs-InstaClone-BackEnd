const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

const { singUp, singIn } = authController;

router.post("/signup", singUp);

router.post("/signin", singIn);

module.exports = router;
