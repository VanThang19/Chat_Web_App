const express = require('express');
const fileUploadController = require('../Controller/fileUploadController');

const router = express.Router();

router.post('/', fileUploadController.uploadFile);

module.exports = router;
