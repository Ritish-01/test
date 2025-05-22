// lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.233.176:5000/auth',
});
