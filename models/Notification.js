const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    recipientType: {
        type: String,
        enum: ['user', 'admin', "admin"],
        required: true,
    },
    
});

// Create a Mongoose model using the schema
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
