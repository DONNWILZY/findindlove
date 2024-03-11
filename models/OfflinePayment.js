const mongoose = require('mongoose');
const Transaction = require('./Transaction');

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
        // required: true,
      },
      textProof: {
        type: String,
      },

      
    currency: {
      type: String,
      enum: ['NGN', 'USD', 'EUR'],
      // required: true
  },
  
    paymentApprovedDate: {
        type: Date
    },

     
},
{
  timestamps: true
});

const OfflinePayment = mongoose.model('OfflinePayment', OfflinePaymentSchema);
module.exports = OfflinePayment;