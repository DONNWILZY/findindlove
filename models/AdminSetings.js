const axios = require('axios');
const mongoose = require('mongoose');

const AdminSettingsSchema = new mongoose.Schema({
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
});

// Static method to create or update admin settings fields including currency conversion
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

// Function to convert USD to NGN
async function convertUSDToNGN(amountInUSD) {
    try {
        // Make API call to fetch latest exchange rates
        const response = await axios.get('https://open.er-api.com/v6/latest/USD');

        // Check if request was successful
        if (response.status === 200) {
            // Extract exchange rate for USD to NGN
            const usdToNgnRate = response.data.rates.NGN;

            // Convert USD to NGN
            const amountInNGN = amountInUSD * usdToNgnRate;

            return amountInNGN;
        } else {
            throw new Error('Failed to fetch exchange rates');
        }
    } catch (error) {
        console.error('Error converting USD to NGN:', error.message);
        throw error;
    }
}

const AdminSettings = mongoose.model('AdminSettings', AdminSettingsSchema);

module.exports = AdminSettings;
