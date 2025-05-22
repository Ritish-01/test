// lib/auth.ts
import { api } from './api';
import * as SecureStore from 'expo-secure-store';

export async function requestOtp(email: string, deviceId: string) {
  const res = await api.post('/request-otp', { email, deviceId });
  return res.data;
}

export async function verifyOtp(email: string, otp: string, deviceId: string) {
  const res = await api.post('/verify-otp', { email, otp, deviceId });
  return res.data;
}

export async function saveLoginData(token: string, email: string) {
  await SecureStore.setItemAsync('token', token);
  await SecureStore.setItemAsync('emailId', email);
}

export async function getLoginData() {
  console.log("getting Login Data");
  console.log('secure Storage', SecureStore);
  const token = await SecureStore.getItemAsync('token');
  const emailID = await SecureStore.getItemAsync('emailId');
  return { token, emailID };
}

export async function clearLoginData() {
  await SecureStore.deleteItemAsync('token');
  await SecureStore.deleteItemAsync('emailID');
}