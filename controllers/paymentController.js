// controllers/paymentController.js

const PaystackService = require('../services/paystack');
const FlutterwaveService = require('../services/flutterwave');
const StripeService = require('../services/stripe');
const PayPalService = require('../services/paypal');
const OfflinePaymentService = require('../services/offline');
const Transaction = require('../models/Transaction');
const OfflinePayment = require('../models/OfflinePayment');





// Controller method to initiate payment with selected gateway
const initiatePayment = async (req, res) => {
    try {
        const { gateway, email, amount, cardToken } = req.body;
        
        let paymentResponse;
        switch (gateway) {
            case 'paystack':
                paymentResponse = await PaystackService.initiatePayment(email, amount);
                break;
            case 'flutterwave':
                paymentResponse = await FlutterwaveService.initiatePayment(email, amount);
                break;
            case 'stripe':
                paymentResponse = await StripeService.initiatePayment(email, amount, cardToken);
                break;
            case 'paypal':
                paymentResponse = await PayPalService.initiatePayment(email, amount);
                break;
            case 'offline':
                // Handle offline payment separately
                return res.status(400).json({ error: 'Offline payment initiation is not supported here.' });
            default:
                return res.status(400).json({ error: 'Invalid payment gateway selected.' });
        }
        
        return res.status(200).json({ paymentResponse });
    } catch (error) {
        console.error('Error initiating payment:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};






// Controller method to submit offline payment proof
const offline = async (req, res) => {
    try {
        const { userId, amount, proofImage, textProof } = req.body;
        
        // Submit the offline payment proof
        const offlinePayment = await OfflinePaymentService.submitProof(userId, amount, proofImage, textProof);
        
        // Create a transaction record for the offline payment
        const transaction = await Transaction.create({
            user: userId,
            transactionId: offlinePayment._id, // Use the ID of the offline payment as the transaction ID
            amount,
            type: 'income', // Assuming this is an incoming transaction
            description: 'Offline Payment',
            status: 'completed' // Assuming the payment is considered completed upon submission
        });
        
        // Respond with the details of the offline payment and the created transaction
        return res.status(200).json({ offlinePayment, transaction });
    } catch (error) {
        console.error('Error submitting offline payment proof:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};







// Controller method to retrieve transaction history for a user
const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user._id; 
        
        const transactions = await Transaction.find({ user: userId }).sort('-timestamp');
        return res.status(200).json({ transactions });
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


// const { }

module.exports = {
    initiatePayment, offline, getTransactionHistory
};
