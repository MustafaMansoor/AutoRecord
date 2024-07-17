const express = require('express');
const { register, login, generateToken } = require('../controller/UserController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/generate-token', generateToken);

module.exports = router;
