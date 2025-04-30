const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  deviceId: { type: String, required: true },
  otp: { type: String },
  otpExpiresAt: { type: Date },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
