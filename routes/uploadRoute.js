const express = require('express');
// const { cloudinary } = require('../config/cloudinary');
const router = express.Router();


const { cloudinary } = require('../config/cloudinary');
const upload = require('../middlewares/multer');



router.post('/upload', upload.single('image'), function(req, res) {
    // Use cloudinary directly, without destructuring
    cloudinary.uploader.upload(req.file.path, function(err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Error in uploading"
            });
        }

        res.status(200).json({
            success: true,
            message: "Uploaded successfully",
            data: result,
        });
    });
});

module.exports = router;
