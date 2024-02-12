//models\OtpCode.js
/////// Model for Otp code 6 digit send on registration
const mongoose = require('mongoose');

const OtpCodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const OtpCode = mongoose.model('OtpCode', OtpCodeSchema);

module.exports = OtpCode;
