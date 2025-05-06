const User = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const requestOtp = async (req, res) => {
    const { email, deviceId } = req.body;

    if (!email || !deviceId) {
        return res.status(400).json({ message: 'Email and deviceId are required' });
    }

    try {
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        let user = await User.findOne({ email });

        if (user) {
            // Update existing user
            user.otp = otp;
            user.otpExpiresAt = otpExpiresAt;
            user.deviceId = deviceId;
        } else {
            // Create new user
            user = new User({ email, deviceId, otp, otpExpiresAt });
        }

        await user.save();

        // TODO: Send OTP to email (to be added after email setup)

        console.log(`Generated OTP for ${email}: ${otp}`);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error requesting OTP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const verifyOtp = async (req, res) => {
    const { email, otp, deviceId } = req.body;

    if (!email || !otp || !deviceId) {
        return res.status(400).json({ message: 'Email, OTP and deviceId are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.deviceId !== deviceId) {
            return res.status(401).json({ message: 'Device mismatch. Please login from your original device.' });
        }

        if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        // OTP is valid, generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Clear OTP so it can't be reused
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        res.status(200).json({ token, message: 'OTP verified successfully' });

    } catch (error) {
        console.error('OTP verification failed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    requestOtp,
    verifyOtp,
}
