const AdminSettings = require('../models/AdminSetings');
const Message = require('../models/AnonymousMessage');
const { cloudinary } = require('../config/cloudinary');
const upload = require('../middlewares/multer');

const sendAnonymousMessage = async (req, res) => {
    try {

        // Find admin settings
        const adminSettings = await AdminSettings.findById('65e42c2b9f1251620098846a');

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
        if (message.length > adminSettings.anonymousCharacter) {
            return res.status(400).json({ error: `Message exceeds the character limit of ${adminSettings.anonymousCharacter}` });
        }

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


const sendThreadMessage = async (req, res) => {
    try {
        // Extract necessary data from the request
        const { userId, message, parentMessageId } = req.body;
        const image = req.file;

        let imageUrl;

        // Upload the image to Cloudinary if provided
        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image.path);
            imageUrl = uploadedImage.secure_url;
        }

        // Find the parent message
        const parentMessage = await Message.findById(parentMessageId);
        if (!parentMessage) {
            return res.status(404).json({ error: 'Parent message not found' });
        }

        // console.log(parentMessageId)

        // Create a new thread message object
        const newThreadMessage = new Message({
            user: userId,
            message: message,
            image: imageUrl,
            parentMessage: parentMessageId,
            turnOnIdentity: false 
        });

        // Save the thread message to the database
        const savedThreadMessage = await newThreadMessage.save();
        
        // Respond with success message and uploaded thread message data
        return res.status(201).json({ 
            message: 'Thread message sent successfully!',
            data: savedThreadMessage
        });
    } catch (error) {
        // Handle any errors
        console.error('Error sending thread message:', error);
        return res.status(500).json({ error: 'An error occurred while sending the thread message' });
    }
};




const getMessageWithThreads = async (req, res) => {
    try {
        const messageId = req.params.messageId;

        // Find the main message by ID
        const mainMessage = await Message.findById(messageId);
        if (!mainMessage) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Find all threads related to the main message
        const threads = await Message.find({ parentMessage: messageId });

        // Initialize a variable to store messages with numbers
        const messagesWithNumbers = [];

        // Add main message with number 1
        messagesWithNumbers.push({ ...mainMessage.toObject(), messageNumber: 1 });

        // Add threads with incrementing numbers
        let messageNumber = 2;
        for (const thread of threads) {
            messagesWithNumbers.push({ ...thread.toObject(), messageNumber });
            messageNumber++;
        }

        // Respond with the messages including numbers
        return res.status(200).json({ message: 'Message retrieved successfully', data: messagesWithNumbers });
    } catch (error) {
        console.error('Error retrieving message with threads:', error);
        return res.status(500).json({ error: 'An error occurred while retrieving the message with threads' });
    }
};


const getMessageWithThreadsForUser = async (userId, messageId) => {
    try {
        // Find the main message by ID
        const mainMessage = await Message.findOne({ _id: messageId, user: userId });
        if (!mainMessage) {
            return { error: 'Message not found' };
        }

        // Find all threads related to the main message
        const threads = await Message.find({ parentMessage: messageId });

        // Initialize a variable to store messages with numbers
        const messagesWithNumbers = [];

        // Add main message with number 1
        messagesWithNumbers.push({ ...mainMessage.toObject(), messageNumber: 1 });

        // Add threads with incrementing numbers
        let messageNumber = 2;
        for (const thread of threads) {
            messagesWithNumbers.push({ ...thread.toObject(), messageNumber });
            messageNumber++;
        }

        return { message: 'Message retrieved successfully', data: messagesWithNumbers };
    } catch (error) {
        console.error('Error retrieving message with threads:', error);
        return { error: 'An error occurred while retrieving the message with threads' };
    }
};


const getAllMessagesForUser = async (userId) => {
    try {
        // Find all messages for the user
        const messages = await Message.find({ user: userId });

        // Initialize an array to store messages with threads and numbers
        const messagesWithThreadsAndNumbers = [];

        // Iterate over each message
        for (const message of messages) {
            // Find and populate threads for the message
            const threads = await Message.find({ parentMessage: message._id });

            // Initialize an array to store threads with numbers
            const threadsWithNumbers = [];

            // Add the parent message with number 1
            const parentMessageWithNumber = { ...message.toObject(), messageNumber: 1 };
            messagesWithThreadsAndNumbers.push(parentMessageWithNumber);

            // Iterate over each thread
            let messageNumber = 2;
            for (const thread of threads) {
                // Add the thread with its number
                const threadWithNumber = { ...thread.toObject(), messageNumber };
                threadsWithNumbers.push(threadWithNumber);
                messageNumber++;
            }

            // Add the threads with numbers to the parent message
            parentMessageWithNumber.threads = threadsWithNumbers;

            // Push the parent message with threads and numbers to the final array
            messagesWithThreadsAndNumbers.push(parentMessageWithNumber);
        }

        return { message: 'Messages retrieved successfully', data: messagesWithThreadsAndNumbers };
    } catch (error) {
        console.error('Error retrieving messages for user:', error);
        return { error: 'An error occurred while retrieving messages for the user' };
    }
};












module.exports = { sendAnonymousMessage, sendThreadMessage, getMessageWithThreads, getMessageWithThreadsForUser, getAllMessagesForUser};
