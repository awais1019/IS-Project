import { create } from "zustand";
import type { User } from "../lib/types";



type authState = {
  uid: string | null;
  role: string | null;
  email: string | null;
  setAuthData: (user: User) => void;
  clearAuthData: () => void;
};

export const useAuthStore = create<authState>((set) => ({
  uid: null,
  role: null,
  email: null,
  setAuthData: (user: User) => {
    set({ uid: user.email, email: user.email, role: user.role });
  },
  clearAuthData: () => set({ uid: null, role: null, email: null }),
}));
