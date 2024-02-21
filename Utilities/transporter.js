// Utilities/transporter.js

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

//node mailer transporter
let transporter = nodemailer.createTransport({
    service: "Gmail",
    secure: false,
    port: 465,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// check for success
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("NODE MAILER IS ACTIVE");
    }
});


module.exports = transporter;
