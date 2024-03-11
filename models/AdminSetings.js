const axios = require('axios');
const mongoose = require('mongoose');

const AdminSettingsSchema = new mongoose.Schema({
    emailNotifications: {
        type: Boolean,
        default: true,
    },
       
    minDepositAmount: {
        type: Number,
        unique: true,
    },
    amountPerVotePoint: {
        type: Number,
        unique: true,
    },
    currency: {
        type: String,
        enum: ['NGN', 'USD'],
        default: 'NGN',
        unique: true,
    },
    allowVoteWithBalance: {
        type: Boolean,
        default: true,
    },

    allowVoteWithVotePoints: {
        type: Boolean,
        default: true,
    },
    allowVoteWithVotereferralPoints: {
        type: Boolean,
        default: true,
    },

    allowFreeMultipleVote: {
        type: Boolean,
        default: false,
    },

    numberOfFreeVotes: {
        type: Number,
        default: 1,
    },

    setReferralPoints: {
        type: Number,
        unique: true,
        default: 5,
    },

    setReferralCredit: {
        type: Number,
        unique: true,
        default: 50,
    },

    storage: {
       type: String,
       enum: ['aws', 'firebase', 'cloudinary', 'gcp'],
       default: 'cloudinary'
    },

    

    referralBonus: {
        type: String,
        enum: ['referralPoints', 'ReferralCredit'],
        default: 'referralPoints',
        
    },


});

//  Static method to create or update admin settings fields including currency conversion
AdminSettingsSchema.statics.createOrUpdateField = async function (field, value) {
    try {
        // Find the admin settings document
        let adminSettings = await this.findOne();

        // If document does not exist, create a new one
        if (!adminSettings) {
            adminSettings = new this();
        }

        // Update the field value
        adminSettings[field] = value;

        // Convert USD to NGN if necessary
        if ((field === 'amountPerVotePoint' || field === 'minDepositAmount') && adminSettings.currency === 'USD') {
            const convertedValue = await convertUSDToNGN(value);
            adminSettings[field] = convertedValue;
        }

        // Save the document
        await adminSettings.save();

        console.log(`Admin settings field "${field}" updated successfully`);
    } catch (error) {
        console.error('Error creating or updating admin settings field:', error.message);
        throw error;
    }
};



const AdminSettings = mongoose.model('AdminSettings', AdminSettingsSchema);

module.exports = AdminSettings;
