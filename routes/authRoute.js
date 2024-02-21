const express = require('express');
const router = express.Router();
const {registerUser } = require('../controllers/authController')


// Route for registering a new user
router.post('/register', registerUser);

module.exports = router;
