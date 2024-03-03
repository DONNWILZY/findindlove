const mongoose = require('mongoose');

const OfflinePaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
   
    amountDeposited: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Declined'],
        default: 'Pending'
    },
    
      proofImage: {
        type: String,
        required: true,
      },
      textProof: {
        type: String,
      },
    paymentApprovedDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const OfflinePayment = mongoose.model('OfflinePayment', OfflinePaymentSchema);
module.exports = OfflinePayment;