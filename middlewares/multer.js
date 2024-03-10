const multer = require('multer');
const fs = require('fs');

// Define the accepted file types
const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];

// Create a function to filter files
const fileFilter = function (req, file, cb) {
    // Check if the file type is in the acceptedFileTypes array
    if (acceptedFileTypes.includes(file.mimetype)) {
        // Accept the file
        cb(null, true);
    } else {
        // Reject the file with an error message
        cb(new Error('File type not supported. Only PNG, JPEG, and GIF files are allowed.'), false);
    }
};

// Configure Multer with file storage and filter
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
