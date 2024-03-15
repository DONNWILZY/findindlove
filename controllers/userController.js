const User = require ('../models/User');
const NotificationService = require('../services/notificationService');

const getWalletBalance = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user.wallet.balance;
    } catch (error) {
        throw new Error('Failed to fetch wallet balance');
    }
};

module.exports = {getWalletBalance}
