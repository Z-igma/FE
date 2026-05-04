import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  login: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isLoggedIn: false,
      accessToken: null,
      login: accessToken => set({ isLoggedIn: true, accessToken }),
      logout: () => set({ isLoggedIn: false, accessToken: null }),
    }),
    {
      name: 'auth',
    },
  ),
);
