const { generateOTPCode } = require('../Utilities/otpCode');
const { generateSystemNumber } = require('../Utilities/appId');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const OtpCode = require("../models/OtpCode");
const transporter = require("../Utilities/transporter");

const registerUser = async (req, res) => {
    const { firstName, lastName, username, phoneNumber, email, password } = req.body;

    try {
        // Check if a user with the provided email or phone  number or username already exists
        let user = await User.findOne({ $or: [{ email }, { phoneNumber }, { username }] });

        if (user) {
            // If user is already verified, inform the user
            if (user.isEmailVerified) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'User already exists and is verified. Please log in.',
                });
            }
            
            // If user is not verified, check if there's a valid OTP code
            const otp = await OtpCode.findOne({ userId: user._id, expiresAt: { $gt: Date.now() } });
            if (otp) {
                // Resend the last OTP code if it hasn't expired yet
                await sendVerificationEmail(email, otp.code);
                return res.status(200).json({
                    status: 'success',
                    message: 'Account already registered. OTP resent for verification.',
                    user: {
                        firstName,
                        lastName,
                        username,
                        phoneNumber,
                        email,
                    }
                });
            }
        }

        // Generate a 10-digit systemNumber
        const systemNumber = generateSystemNumber();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            username,
            phoneNumber,
            email,
            password: hashedPassword,
            systemNumber,
            isEmailVerified: false
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Generate an OTP code
        const otpCode = generateOTPCode();
        const otpExpiration = new Date(Date.now() + (60 * 60 * 1000)); // Expires after 1 hour
        await new OtpCode({
            userId: savedUser._id,
            code: otpCode,
            expiresAt: otpExpiration
        }).save();

        // Send verification email
        await sendVerificationEmail(email, otpCode);

        // Generate auth token
        const authToken = jwt.sign({ userId: savedUser._id }, process.env.JWT_SEC_KEY);

        return res.status(200).json({
            status: 'success',
            message: 'Sign up successful, OTP sent for verification.',
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                username: savedUser.username,
                phoneNumber: savedUser.phoneNumber,
                email: savedUser.email,
                AppId: systemNumber,
                authToken // auth token included in response 
            }
        });
    } catch (error) {
        console.error('Error while registering user:', error);
        return res.status(500).json({
            status: 'failed',
            message: 'An error occurred while signing up. Please try again.'
        });
    }
};

const sendVerificationEmail = async (email, otpCode) => {
    try {
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `
                <h1>Email Verification</h1>
                <p>Welcome, Please enter the verification code to continue:</p>
                <h2>${otpCode}</h2>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully.");
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email.");
    }
};

module.exports = { registerUser };
