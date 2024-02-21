const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const connectToDatabase = require('../config/db');
dotenv.config();

// Establish database connection
connectToDatabase();

// Nodemailer transporter
let sendEmail = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Function to send a test email
const sendTestEmail = () => {
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: process.env.AUTH_EMAIL, // Send the test email to yourself
        subject: 'Test Email from Node.js',
        text: 'This is a test email from your Node.js application.'
    };

    sendEmail.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending test email:', error);
        } else {
            console.log('Test email sent:', info.response);
        }
    });
};

// Check for success
sendEmail.verify((error, success) => {
    if (error) {
        console.log('Error verifying email server:', error);
    } else {
        console.log("Email server is active");
        // Send a test email after the server is verified
        sendTestEmail();
    }
});

module.exports = sendEmail;
