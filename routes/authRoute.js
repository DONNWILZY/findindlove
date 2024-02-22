const express = require('express');
const router = express.Router();
const { registerUser,
    login,
    logout,
} = require('../controllers/authController')


// Route for registering a new user
router.post('/register', registerUser);
// Route for Login
router.post('/login', login);
// route to logout
router.post('/logout', logout);
// request OTP
router.post('/requestotp',);
//verify OTP
router.post('/veryotp',);
//request password reset
router.post('/requestpasswordreset',);
// verify password rest otp
router.post('/verifypasswordresetOtp',);
// enter new password
router.post('/newPassword',);
// change password
router.post('/changepassword',);

module.exports = router;
