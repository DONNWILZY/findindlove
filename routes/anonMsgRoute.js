const express = require('express');
const router = express.Router();
const { cloudinary } = require('../config/cloudinary');
const upload = require('../middlewares/multer');
const { sendAnonymousMessage, sendThreadMessage, getMessageWithThreads, getMessageWithThreadsForUser, getAllMessagesForUser  } = require('../controllers/anonymousMessageController'); 
const {verifyToken, 
    verifyUser, 
    verifyAdmin, 
    verifyStaff, 
    verifySuperAdmin, 
    checkPermission} = require('../middlewares/authMiddleware');




// Route for sending anonymous messages
router.post('/send', upload.single('image'), sendAnonymousMessage);
// add thread to message
router.post('/thread', upload.single('image'), sendThreadMessage);
// Route for getting a single message with threads
router.get('/message/:messageId', verifyToken, verifyUser || checkPermission('get_anony'),  getMessageWithThreads);

// Route to get a single message with threads for a user
router.get('/messages/:messageId/:userId', verifyToken, verifyUser || checkPermission('get_anony'),   async (req, res) => {
    try {
        const userId = req.params.userId;
        const messageId = req.params.messageId;

        // Call the function to get the message with threads for the user
        const result = await getMessageWithThreadsForUser(userId, messageId);

        // Check if there was an error
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }

        // If successful, return the retrieved message with threads
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error getting message with threads for user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Route for getting all messages for a user
router.get('/messages/:userId', verifyToken, verifyUser || checkPermission('get_anony'),  async (req, res) => {
    try {
        const userId = req.params.userId;

        // Call the function to get all messages for the user
        const result = await getAllMessagesForUser(userId);

        // Check if there was an error
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }

        // If successful, return the retrieved messages
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error getting messages for user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = router;
