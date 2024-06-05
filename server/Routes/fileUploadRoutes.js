// fileUploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../Middleware/uploadMiddleware');
const updateFileMiddleware = require('../middleware/updateFileMiddleware');

router.put('/upload/:id', upload.single('file'), updateFileMiddleware);

module.exports = router;
