const express = require("express");
const {
  register,
  login,
  validateToken,
  resetPassword,
  updatePassword,
  getProfile,
  updateProfile,
} = require("../controller/UserController");

const { invitePeople } = require("../controller/InvitePeople");
const { authMiddleware } = require("../middleware/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/validate-token", validateToken);
router.post("/reset-password", resetPassword);
router.post("/update-password", updatePassword);
router.post("/invite", invitePeople);

router.get("/profile", authMiddleware, getProfile);

// Route to update the profile of the logged-in user
router.put("/update", authMiddleware, updateProfile);

module.exports = router;
