const CryptoJS = require('crypto-js');
const SECRET_KEY = process.env.SECRET_KEY || 'your-32-char-secret-key';

function encrypt(data) {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

function decrypt(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { encrypt, decrypt };
