const User = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendOtpEmail = require('../config/mail');
console.log("inside controller");
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

const requestOtp = async (req, res) => {
  console.log("hjhasbjas")
  const { email, deviceId } = req.body;
  if (!email || !deviceId) return res.status(400).json({ message: 'Email and deviceId are required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = hashOtp(otp);
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  let user = await User.findOne({ email, deviceId });
  console.log(user);
  if (user) {
    user.otpHash = otpHash;
    user.otpExpiresAt = otpExpiresAt;
    user.deviceId = deviceId;
  } else {
    user = new User({ email, deviceId, otpHash, otpExpiresAt });
  }
  await sendOtpEmail(email, otp);
  res.status(200).json({ message: 'OTP sent successfully' });
};

const verifyOtp = async (req, res) => {
  const { email, otp, deviceId } = req.body;

  if (!email || !otp || !deviceId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  // if (user.otpExpiresAt < Date.now()) {
  //   return res.status(401).json({ message: 'OTP expired' });
  // }

  // if (user.otpHash !== hashOtp(otp)) {
  //   return res.status(401).json({ message: 'Invalid OTP' });
  // }

  const newToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  user.accessToken = newToken;
  user.otpHash = null;
  user.otpExpiresAt = null;
  user.verified = true;

  await user.save();

  return res.status(200).json({
    message: 'OTP verified successfully',
    token: newToken,
  });
};


const validateToken = async (req, res) => {
  const { token, phoneNumber } = req.body;

  if (!token || !phoneNumber) {
    return res.status(400).json({ message: 'Missing token or phone number' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ phoneNumber });

    if (!user || user._id.toString() !== decoded.userId) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({ message: 'Valid user' });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const checkUserExists = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email ID is required' });

  const user = await User.findOne({ email });
  if (user) {
    return res.status(200).json({ exists: true, email: user.email });
  } else {
    return res.status(404).json({ exists: false });
  }
};

const signupUser = async (req, res) => {
  const { email, name, country, location, image, city, deviceId } = req.body;

  if (!email || !name || !country || !location) {
    return res.status(400).json({ message: 'All required fields must be filled' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      name,
      country,
      location,
      photoUrl: image,
      verified: false,
      city,
      deviceId
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.status(201).json({ message: 'Signup successful', token });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const validateSession = async (req, res) => {
  try {
    const { payload } = req.body;
    if (!payload) return res.status(400).json({ goodToGo: false });

    const decrypted = JSON.parse(decrypt(payload));
    const { email, accessToken, deviceId } = decrypted;

    const user = await User.findOne({ email });

    if (!user) return res.json({ goodToGo: false });

    if (user.deviceId !== deviceId || user.accessToken !== accessToken) {
      return res.json({ goodToGo: false });
    }

    return res.json({ goodToGo: true });
  } catch (err) {
    console.error("Session validation failed:", err);
    return res.status(500).json({ goodToGo: false });
  }
}

module.exports = { requestOtp, verifyOtp , validateToken , checkUserExists, signupUser, validateSession};
