const express = require("express");
const {
  register,
  login,
  generateToken,
  sendEmail,
  validateToken
} = require("../controller/UserController");

const {invitePeople} = require("../controller/InvitePeople");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/generate-token", generateToken);
router.post("/send-email", sendEmail);

router.post('/validate-token',validateToken);

router.post('/invite',invitePeople);


module.exports = router;
