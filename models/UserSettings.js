const mongoose = require('mongoose');

const UserSettingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    theme: {
        type: String,
        default: 'light',
        enum: ['light', 'dark'],
    },
    emailNotifications: {
        type: Boolean,
        default: true,
    },
    notificationSound: {
        type: Boolean,
        default: true,
    },
    minDepositAmount: {
       type: Number,
    },

  
   
});


const UserSettings = mongoose.model('UserSettings', UserSettingsSchema);

module.exports = UserSettings;
