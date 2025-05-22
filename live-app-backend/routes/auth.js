const express = require('express');
const rateLimit = require('express-rate-limit');
const { requestOtp, verifyOtp, validateSession, signupUser, checkUserExists } = require('../controllers/authController');
const router = express.Router();

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: 'Too many OTP requests, try again later',
});
console.log("auth")

router.post('/request-otp', otpLimiter, requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/check-user', checkUserExists);
router.post('/signup', signupUser);
router.post('validate-session', validateSession)

const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = router;
