const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  // phoneNumber: { type: String, required: true, unique: true },
  country: { type: String },
  location: { type: String },
  photoUrl: { type: String },
  otpHash: { type: String },
  otpExpiresAt: { type: Date },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  deviceId: { type: String }
});

module.exports = mongoose.model('User', userSchema);
