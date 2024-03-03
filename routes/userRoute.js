const express = require('express');
const router = express.Router();
const {getWalletBalance} = require('../controllers/userController');

// Route to get wallet balance of a user
router.get('/users/:userId/walletBalance', async (req, res) => {
    try {
        const userId = req.params.userId;
        const walletBalance = await getWalletBalance(userId);
        res.status(200).json({ userId, walletBalance });
    } catch (error) {
        console.error('Error fetching wallet balance:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
