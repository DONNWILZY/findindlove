const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

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

// Check for success
sendEmail.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("NODE MAILER IS ACTIVE");
    }
});

module.exports = sendEmail;
