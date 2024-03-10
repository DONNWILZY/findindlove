const express = require('express');
const router = express.Router();
const {submitProof} = require('../services/offline');
const {offline, getAllTransactions, getTransaction, getSingleTransaction, getAllTransactionsForUser, purchaseVotePoints} = require('../controllers/paymentController');
const { cloudinary } = require('../config/cloudinary');
const upload = require('../middlewares/multer');


// Route to submit offline payment proof
router.post('/offlines', offline);

router.post('/offline', upload.single('proofImage'), submitProof);
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


/// purchase votepoints
router.post('/purchase/vote', async (req, res) => {
    try {
        // Extract userId and votePointsRequested from request body
        const { userId, votePointsRequested } = req.body;

        // Call purchaseVotePoints function to handle the purchase
        const result = await purchaseVotePoints(userId, votePointsRequested);

        // Send response based on the result of the purchase operation
        if (result) {
            res.status(200).json({ message: `${votePointsRequested} vote points purchased successfully.` });
        } else {
            res.status(400).json({ error: 'Failed to purchase vote points.' });
        }
    } catch (error) {
        console.error('Error purchasing vote points:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
