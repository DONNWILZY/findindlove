// notificationMiddleware.js

const Notification = require('./models/Notification');

async function sendNotification(userId, recipientType, message) {
    // Create a new notification
    const notification = new Notification({
        user: userId, /// incase there is  reference to another user
        recipients: [userId], // Notify the user who initiated the action
        message,
        recipientType,
        timestamp: Date.now()
    });

    // Save the notification to the database
    await notification.save();
}

function notificationMiddleware(req, res, next) {
    // Add a method to the response object to send notifications
    res.sendNotification = async function (recipientType, message) {
        // Assuming you have userId available in the request object
        const userId = req.user ? req.user._id : null; // Adjust as needed

        if (userId) {
            // Send notification
            await sendNotification(userId, recipientType, message);
        }
    };

    // Pass control to the next middleware
    next();
}

module.exports = notificationMiddleware;
