'use client';

import { User } from '@/types/user';
import { create } from 'zustand';

type AuthStore = {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (partial: Partial<User>) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : state.user,
    })),
  clearUser: () => set({ user: null }),
}));
