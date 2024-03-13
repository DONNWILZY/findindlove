const AdminSettings = require('../models/AdminSetings');
const Message = require('../models/AnonymousMessage');
const { cloudinary } = require('../config/cloudinary');
// const multer = require('multer');
// const upload = require('../middlewares/multer');
const upload = require('../middlewares/multer');

const sendAnonymousMessage = async (req, res) => {
    try {
        // Extract necessary data from the request
        const { userId, message, name } = req.body;
        const image = req.file;


        let imageUrl;

        // Upload the image to Cloudinary if an image is provided
        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image.path);
            imageUrl = uploadedImage.secure_url;
        }

        // console.log('Image received:', image, imageUrl, message);

        // Create a new message object
        const newMessage = new Message({
            user: userId,
            message: message,
            image: imageUrl,
            name: name,
            turnOnIdentity: false 
        });

        // Save the message to the database
        const savedMessage = await newMessage.save();
        
        // Respond with success message and uploaded message data
        return res.status(201).json({ 
            message: 'Message sent successfully!',
            data: savedMessage
        });
    } catch (error) {
        // Handle any errors
        console.error('Error sending anonymous message:', error);
        return res.status(500).json({ error: 'An error occurred while sending the message' });
    }
};

module.exports = { sendAnonymousMessage };
