const multer = require('multer');
const express = require('express');

const app = express();

const FileUpload = require('../Models/fileUploadModel');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Giữ nguyên tên file gốc
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 9000000 } // Giới hạn kích thước file 9MB
}).single('file');

const uploadFile = async (req, res, next) => {
    try {
        await upload(req, res);

        if (!req.file) {
            return res.status(400).json({ message: 'No file selected' });
        }

        // Kiểm tra định dạng file (chỉ cho phép ảnh)
        if (!req.file.mimetype.startsWith('image/')) {
            return res.status(400).json({ message: 'Only image files are allowed' });
        }

        const fileUpload = new FileUpload({
            name: req.file.originalname,
            size: req.file.size,
            url: req.file.path,  // Sử dụng đường dẫn trực tiếp từ multer
            type: req.file.mimetype,
            userName: req.body.userName
        });

        await fileUpload.save(); // Sử dụng await để đợi lưu vào cơ sở dữ liệu

        res.status(200).json({ message: 'File uploaded successfully', file: req.file.originalname });
    } catch (err) {
        next(err);
    }

};
app.post('/upload', (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return next(err); // Chuyển đến middleware xử lý lỗi tiếp theo
        }
        next(); // Không có lỗi, tiếp tục xử lý trong hàm uploadFile
    });
}, uploadFile);

module.exports = { uploadFile };
