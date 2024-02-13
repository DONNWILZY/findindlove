const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
    adminId: {
        type: String,
        required: true,
        unique: true,
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


const AdminSettings = mongoose.model('AdminSettings', adminSettingsSchema);

module.exports = AdminSettings;
