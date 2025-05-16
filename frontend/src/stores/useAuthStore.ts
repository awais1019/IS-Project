import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  verify: boolean;
  is2FAEnabled?: boolean;
};

type AuthState = {
  token: string | null;
  user: User | null;
  is2FAVerified: boolean; // add here
  setAuth: (token: string | null, user: User) => void;
  updateUser: (partialUser: Partial<User>) => void;
  logout: () => void;
  set2FAVerified: (verified: boolean) => void; // new setter
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      is2FAVerified: false, 

      setAuth: (token, user) => set({ token, user }),

      updateUser: (partialUser) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({ user: { ...currentUser, ...partialUser } });
      },

      set2FAVerified: (verified: boolean) => set({ is2FAVerified: verified }),

      logout: () => {
        set({ token: null, user: null, is2FAVerified: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
       
      }),
    }
  )
);
