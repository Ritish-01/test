const nodemailer = require('nodemailer');

console.log('EMAIL_USER:', process.env.EMAIL_USER); // Just for debugging
console.log('EMAIL_PASS:', process.env.EMAIL_PASS); // Just for debugging

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"OTP Auth" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP Code',
    html: `<h3>Your OTP is: <strong>${otp}</strong></h3><p>Expires in 10 minutes.</p>`,
  });
};

module.exports = sendOtpEmail;
