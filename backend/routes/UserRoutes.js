const express = require("express");
const {
  register,
  login,
  validateToken,
  resetPassword,
  updatePassword,
} = require("../controller/UserController");

const { invitePeople } = require("../controller/InvitePeople");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/validate-token", validateToken);
router.post("/reset-password", resetPassword);
router.post("/update-password", updatePassword);

router.post("/invite", invitePeople);

module.exports = router;
