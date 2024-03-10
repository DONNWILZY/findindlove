//servives/offline
const OfflinePayment = require('../models/OfflinePayment');
const { cloudinary } = require('../config/cloudinary');

const {upload} = require('../middlewares/multer');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


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
