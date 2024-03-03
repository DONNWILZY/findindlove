import User from '../models/User';

const getWalletBalance = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const walletBalance = user.balance;

        return walletBalance;
    } catch (error) {
        console.error('Error fetching wallet balance:', error.message);
        throw error;
    }
};

module.exports = {getWalletBalance}
