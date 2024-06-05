// updateFileMiddleware.js
const FileUpload = require('../Models/fileUploadModel'); // Import model FileUpload
const fs = require('fs'); // Import module fs để xóa file

const updateFileMiddleware = async (req, res, next) => {
    try {
        const fileId = req.params.id; // Lấy ID của tệp cần cập nhật
        const newFile = req.file; // Lấy thông tin tệp mới (nếu sử dụng Multer)

        // Tìm tệp cũ trong cơ sở dữ liệu
        const oldFile = await FileUpload.findById(fileId);
        if (!oldFile) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Cập nhật thông tin tệp trong cơ sở dữ liệu
        oldFile.name = newFile.originalname;
        oldFile.size = newFile.size;
        oldFile.url = newFile.path;
        oldFile.type = newFile.mimetype;
        await oldFile.save();

        // Xóa tệp cũ (nếu cần)
        fs.unlinkSync(oldFile.url);

        res.status(200).json({ message: 'File updated successfully', file: oldFile });
    } catch (err) {
        next(err); // Chuyển lỗi đến middleware xử lý lỗi chung
    }
};

module.exports = updateFileMiddleware;
