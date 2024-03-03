// models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'failed', 'completed', 'declined'],
        default: 'pending'
    },
    description: {
        type: String
    },

    offline:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfflinePayment',
    },

}, {
    timestamps: true 
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
