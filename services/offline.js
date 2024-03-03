const OfflinePayment = require('../models/OfflinePayment');

// Function to submit offline payment proof
const submitProof = async (userId, amount,  proofImage, textProof, currency) => {
    try {
        // Save offline payment record to database
        const offlinePayment = await OfflinePayment.create({
            user: userId,
            amountDeposited: amount,
            proofImage: proofImage,
            textProof: textProof,
            currency: currency,
            paymentStatus: 'Pending',
        });
        return offlinePayment;
    } catch (error) {
        console.error('Error submitting offline payment proof:', error);
        throw new Error('Failed to submit offline payment proof');
    }
};

module.exports = {
    submitProof,
};
