// services/offlinePayment.js

// Function to submit offline payment proof
const submitProof = async (userId, amount, proofImage) => {
    try {
        // Save offline payment record to database
        const offlinePayment = await OfflinePayment.create({
            user: userId,
            amount,
            proofImage,
            status: 'Pending',
        });
        return offlinePayment;
    } catch (error) {
        throw new Error('Failed to submit offline payment proof');
    }
};

module.exports = {
    submitProof,
};
