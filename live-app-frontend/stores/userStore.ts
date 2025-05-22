import { create } from 'zustand';

interface UserState {
  email: string;
  deviceId: string;
  token: string;
  setEmail: (email: string) => void;
  setDeviceId: (deviceId: string) => void;
  setToken: (token: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  email: '',
  deviceId: '',
  token: '',
  setEmail: (email) => set({ email }),
  setDeviceId: (deviceId) => set({ deviceId }),
  setToken: (token) => set({ token }),
}));
