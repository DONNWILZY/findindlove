const express = require('express');
const router = express.Router();
const {offline} = require('../controllers/paymentController');

// Route to submit offline payment proof
router.post('/offline', offline);

module.exports = router;
