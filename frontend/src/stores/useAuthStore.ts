import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  email: string;
  name:string;
  role: string;
  verify:boolean;
};

type AuthState = {
  token: string | null;
  user: User | null;
  setAuth: (token: string  | null, user: User) => void;
   updateUser: (partialUser: Partial<User>) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set,get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
       updateUser: (partialUser) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({ user: { ...currentUser, ...partialUser } });
      },
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage', 
    }
  )
);
