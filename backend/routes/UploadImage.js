const express = require('express');
const router = express.Router(); // Fixed: Changed 'router' to 'Router()'
const { getData } = require('../controller/UploadImage');

router.route('/').post(getData);
module.exports = router;