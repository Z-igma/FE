import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  login: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      login: accessToken => set({ accessToken }),
      logout: () => set({ accessToken: null }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
