import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '../interfaces/auth-state.interface';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      domain: null,

      setLogin: (data, domain) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('jwt_token', data.access_token);
        }
        set({ 
          token: data.access_token, 
          refreshToken: data.refresh_token, 
          user: data.user, 
          domain 
        });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('jwt_token', accessToken);
        }
        set({ token: accessToken, refreshToken });
      },

      setLogout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwt_token');
        }
        set({ token: null, refreshToken: null, user: null, domain: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
