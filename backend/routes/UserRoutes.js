const express = require("express");
const {
  register,
  login,
  generateToken,
  sendEmail,
} = require("../controller/UserController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/generate-token", generateToken);
router.post("/send-email", sendEmail);

module.exports = router;
