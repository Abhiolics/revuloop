import { storage, AppState } from './storage';
import { delay } from '@/lib/utils';

export const authService = {
  login: async (email: string, otp: string) => {
    await delay(800);
    // Hardcoded mock check
    if (email === 'owner@royalcafe.demo' && otp === '123456') {
      const state = storage.get();
      state.currentUser = { email, isAuthenticated: true };
      storage.set(state);
      return { success: true };
    }
    if (otp !== '123456') {
      throw new Error('Invalid verification code');
    }
    return { success: true };
  },
  
  logout: async () => {
    await delay(400);
    const state = storage.get();
    state.currentUser = null;
    storage.set(state);
  },
  
  sendOtp: async (email: string) => {
    await delay(800);
    // In demo, we just pretend it succeeds
    return { success: true, message: 'OTP sent successfully' };
  },

  getCurrentUser: async () => {
    await delay(300);
    return storage.get().currentUser;
  }
};
