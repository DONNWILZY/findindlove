const express = require('express');
const router = express.Router();
const { cloudinary } = require('../config/cloudinary');
const upload = require('../middlewares/multer');
const { sendAnonymousMessage } = require('../controllers/anonymousMessageController'); 

// Route for sending anonymous messages
router.post('/send', upload.single('image'), sendAnonymousMessage);


module.exports = router;
