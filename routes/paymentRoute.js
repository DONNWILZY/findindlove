const express = require('express');
const router = express.Router();
const {offline, getAllTransactions, getTransaction} = require('../controllers/paymentController');

// Route to submit offline payment proof
router.post('/offline', offline);

//get ll transactions
router.get('/transactions', getAllTransactions);

// get sing; transaction
router.get('/hisotory/:transactionId', getTransaction);

module.exports = router;
