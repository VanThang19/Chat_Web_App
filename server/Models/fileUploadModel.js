const mongoose = require('mongoose');

const FileUploadModel = mongoose.Schema({
    userName: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
    },
    url: {
        type: String,
    },
    type: {
        type: String,
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('FileUpload', FileUploadModel);        