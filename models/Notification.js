const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    recipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    }],
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
        enum: ['user', 'admin', 'superAdmin', 'Moderator'],
        required: true,
    },
    activityType: {
        type: String,
        required: true,
    },
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    frequency: {
        type: String,
        enum: ['immediate', 'daily digest', 'weekly summary'],
    },
    customSound: {
        type: String,
    },
    userActions: {
        likes: {
            type: Boolean,
            default: true,
        },
        comments: {
            type: Boolean,
            default: true,
        },
        mentions: {
            type: Boolean,
            default: true,
        },
    },
    NotifyLogin:{
        type: Boolean,
        default: false,
    },
    contextual: {
        locationBased: {
            type: Boolean,
            default: true,
        },
        timeBased: {
            type: Boolean,
            default: true,
        },
        deviceBased: {
            type: Boolean,
            default: true,
        },
    },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
