const express = require('express');
const router = express.Router();
const {offline, getAllTransactions, getTransaction, getSingleTransaction, getAllTransactionsForUser} = require('../controllers/paymentController');

// Route to submit offline payment proof
router.post('/offline', offline);

//get ll transactions
router.get('/transactions', getAllTransactions);

// get sing; transaction
router.get('/hisotory/:transactionId', getTransaction);

// // Route to get a single transaction for a user with a specific transaction ID
router.get('/user/:userId/:transactionId',  getTransaction) 


// Route to fetch all transactions for a user
router.get('/transactions/:userId', async (req, res) => {
    try {
        // Call the controller function to fetch all transactions for the user
        const transactions = await getAllTransactionsForUser(req.params.userId);
        
        // Respond with the fetched transactions
        return res.status(200).json({ transactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
