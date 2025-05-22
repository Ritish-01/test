// utils/crypto.ts
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-32-char-secret-key'; // store in .env if possible

export function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export function decrypt(cipherText: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
