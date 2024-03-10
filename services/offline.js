// servives/offline
const OfflinePayment = require('../models/OfflinePayment');
const { cloudinary } = require('../config/cloudinary');

const {upload} = require('../middlewares/multer');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Function to submit offline payment proof
const submitProof = async (req, res) => {
    try {
      const { userId, amount, textProof, currency } = req.body;
  
      // Get the uploaded image information from Multer
      const proofImage = req.file; // Access the uploaded file data
  
      let proofImageUrl;
  
      // Check for image or pre-uploaded URL
      if (typeof proofImage === 'string') {
        // Assume it's a pre-uploaded image URL
        proofImageUrl = proofImage;
      } else if (proofImage) {
        // Upload the image to Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(proofImage.path);
        proofImageUrl = uploadedImage.secure_url;
      } else {
        // No image provided
        throw new Error('Missing image proof');
      }
  
      // Save offline payment record to database
      const offlinePayment = await OfflinePayment.create({
        user: userId,
        amountDeposited: amount,
        proofImage: proofImageUrl,
        textProof: textProof,
        currency: currency,
        paymentStatus: 'Pending',
      });
  
      res.json({ success: true, data: offlinePayment });
    } catch (error) {
      console.error('Error submitting offline payment proof:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  
  


module.exports = {
    submitProof,
};
