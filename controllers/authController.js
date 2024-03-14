const { generateOTPCode } = require('../Utilities/otpCode');
const { generateSystemNumber } = require('../Utilities/appId');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const OtpCode = require("../models/OtpCode");
const transporter = require("../Utilities/transporter");
const Notification = require("../models/Notification");


//////////////// SIGNUP HERE HERE /////////////////////////
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




//////////////// LOGIN HERE /////////////////////////
const login = async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;

  try {
      // Find user by username, email, or phone number
      const user = await User.findOne({
          $or: [{ username }, { email }]
      });

      if (!user) {
          return res.status(404).json({
              status: "failed",
              message: "User not found."
          });
      }

      // Check if the user's email is verified
      if (!user.isEmailVerified) {
          return res.status(400).json({
              status: "failed",
              message: "Email is not verified. Please verify your email address."
          });
      }

      // Check if the user's account is blocked
      if (user.accountStatus.action === "blocked") {
          // Check if it's time to retry login
          const duration = parseInt(user.accountStatus.duration);
          const durationType = user.accountStatus.durationType;

          if (duration > 0) {
              return res.status(403).json({
                  status: "failed",
                  message: `Your account is blocked. You can try again in ${duration} ${durationType}.`
              });
          }
      }

      // Compare passwords
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
          // Update account status on failed login attempts
          // This part is not implemented here, but you can implement it to update the account status accordingly

          return res.status(401).json({
              status: "failed",
              message: "Invalid credentials."
          });
      }

      // Generate auth token
      const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SEC_KEY);

      // Check if NotifyLogin is true and send notification
      if (user.NotifyLogin) {
          const message = "You have logged in to your account.";
          sendNotification(user._id, message);
      }

      // Update account status to online
       user.accountStatus.action = "online";
      await user.save();

      // Return user data
      return res.status(200).json({
          status: "success",
          user: {
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              AppId: user.systemNumber,
              authToken,
              accountStatus: user.accountStatus.action,
              role: user.role,
              id: user._id

          }
      });
  } catch (error) {
      console.error("Error while logging in:", error);
      return res.status(500).json({
          status: "failed",
          message: "An error occurred while logging in. Please try again."
      });
  }
};

const sendNotification = async (userId, message) => {
  try {
      // Retrieve user's email
      const user = await User.findById(userId);
      const email = user.email;

      // Send notification via email
      const mailOptions = {
          from: process.env.AUTH_EMAIL,
          to: email,
          subject: "New Login Notification",
          text: message
      };
      await transporter.sendMail(mailOptions);

      // Send notification via in-app notification (if applicable)
      // This part is not implemented here, but you can implement it according to your application's logic
  } catch (error) {
      console.error("Error sending notification:", error);
      throw new Error("Failed to send notification.");
  }
};


const logout = async (req, res) => {
  const userId = req.user.id;
  try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Clear authentication token (if any)
      user.authToken = null;

      // Change user status to offline
      user.accountStatus.action = 'offline';

      // Save the updated user
      await user.save();

      return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
      console.error('Error while logging out:', error);
      return res.status(500).json({ message: 'An error occurred while logging out' });
  }
};





module.exports = { registerUser, login, logout };
