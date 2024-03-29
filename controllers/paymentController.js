// controllers/paymentController.js

const PaystackService = require('../services/paystack');
const FlutterwaveService = require('../services/flutterwave');
const StripeService = require('../services/stripe');
const PayPalService = require('../services/paypal');
const OfflinePaymentService = require('../services/offline');
const Transaction = require('../models/Transaction');
const OfflinePayment = require('../models/OfflinePayment');
const AdminSettings = require('../models/AdminSetings');
const User = require('../models/User');
/// functon ot generate shortId
const generateShortId = require('../Utilities/generateShortId');
//currency Conveter
const convertToNGN = require('../Utilities/currencyConverter');





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
// const offline = async (req, res) => {
//     try {
//         const { userId, amount, proofImage, textProof } = req.body;
        
//         // Submit the offline payment proof
//         const offlinePayment = await OfflinePaymentService.submitProof(userId, amount, proofImage, textProof);
        
//         // Create a transaction record for the offline payment
//         const transaction = await Transaction.create({
//             user: userId,
//             transactionId: // Unique short Id for transaction
//             amount,
//             offline, // Use the ID of the offline payment as the transaction ID
//             currency,
//             type: 'income', 
//             description: 'Offline Payment',
//             status: 'completed' 
//         });
        
//         // Respond with the details of the offline payment and the created transaction
//         return res.status(200).json({ offlinePayment, transaction });
//     } catch (error) {
//         console.error('Error submitting offline payment proof:', error);
//         return res.status(500).json({ error: 'Internal server error.' });
//     }
// };



const offline = async (req, res) => {
    try {
        const { userId, amount, proofImage, textProof, currency } = req.body;
        
        // Submit the offline payment proof
        const offlinePayment = await OfflinePaymentService.submitProof(userId, amount, proofImage, textProof, currency);
        
        let transactionId;

        // Convert amount to Naira if currency is not NGN or EUR
        if (currency !== 'NGN' && currency !== 'EUR') {
            const amountInNGN = await convertToNGN(amount, currency);
            // Create a transaction record for the offline payment
            const transaction = await Transaction.create({
                user: userId,
                transactionId: generateShortId(), // Generate a unique short ID for the transaction
                amount: amountInNGN,
                currency,
                offline: offlinePayment._id, // Use the ID of the offline payment as the transaction ID
                type: 'income', 
                description: 'Offline Payment',
                status: 'completed' 
            });
            transactionId = transaction._id;
        } else {
            // Create a transaction record for the offline payment
            const transaction = await Transaction.create({
                user: userId,
                transactionId: generateShortId(), // Generate a unique short ID for the transaction
                amount,
                offline: offlinePayment._id, // Use the ID of the offline payment as the transaction ID
                currency,
                type: 'income', 
                description: 'Offline Payment',
                status: 'completed' 
            });
            transactionId = transaction._id;
        }
        
        // Respond with the details of the offline payment and the created transaction
        return res.status(200).json({ offlinePayment, transactionId });
    } catch (error) {
        console.error('Error submitting offline payment proof:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('offline');
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const getTransaction = async (req, res) => {
    try {
        const transactionId = req.params.transactionId;
        
        // Find the transaction by ID and populate the 'offline' field with the OfflinePayment data
        const transaction = await Transaction.findById(transactionId).populate('offline');
        
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        
        res.status(200).json({ transaction });
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const getSingleTransaction = async (req, res) => {
    try {
        const { userId, transactionId } = req.params;
        
        // Find the transaction for the specified user ID and transaction ID, and populate the offline payment
        const transaction = await Transaction.findOne({ user: userId, _id: transactionId }).populate('offline');
        
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        return res.status(200).json({ transaction });
    } catch (error) {
        console.error('Error fetching transaction:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


// Function to fetch all transactions for a user
const getAllTransactionsForUser = async (userId) => {
    try {
        // Query the Transaction model to find all transactions for the specified user
        const transactions = await Transaction.find({ user: userId }).populate('offline');
        return transactions;
    } catch (error) {
        console.error('Error fetching transactions for user:', error);
        throw new Error('Failed to fetch transactions for user');
    }
};



//// buy votePoint
const purchaseVotePoints = async (userId, votePointsRequested) => {
    try {
        // Fetch admin settings to get the amount per vote point
        const adminSettings = await AdminSettings.findById('65e42c2b9f1251620098846a');
        const amountPerVotePoint = adminSettings.amountPerVotePoint;

        // Calculate total amount based on the number of vote points requested
        const totalAmount = votePointsRequested * amountPerVotePoint;

        // Fetch user
        const user = await User.findById(userId);

        // Check if user exists and has a wallet
        if (!user || !user.wallet.balance) {
            console.error('User not found or wallet is missing.');
            return false; // Return false to indicate failure
        }

        // Check if user has sufficient balance to cover the purchase
        const balanceAfterPurchase = user.wallet.balance - totalAmount;
        if (!balanceAfterPurchase && balanceAfterPurchase <=0) {
            console.error('Insufficient balance.');
            return false; // Return false to indicate failure
        }

        // Create a transaction record
        const transaction = new Transaction({
            user: userId,
            transactionId: generateShortId(),
            type: 'expense',
            amount: totalAmount,
            description: `${votePointsRequested} vote points purchased`,
            status: 'completed'
        });
        await transaction.save();

        // Update user's vote points
        user.wallet.votePoints += votePointsRequested;

        // Deduct the purchase amount from the user's balance
        user.wallet.balance -= totalAmount;

        // Save updated user
        await user.save();

        console.log(`${votePointsRequested} vote points purchased successfully.`);
        return true; // Return true to indicate success
    } catch (error) {
        console.error('Error purchasing vote points:', error);
        return false; // Return false to indicate failure
    }
}






















module.exports = {
    initiatePayment, offline,  getAllTransactions, getTransaction, getSingleTransaction, getAllTransactionsForUser, purchaseVotePoints
};
