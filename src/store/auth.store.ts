import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AUTH_SESSION_STORAGE_KEY } from '../constants/config';
import { getUsers, seedUsers } from '../services/auth/auth.service';
import { validateCredentials } from '../lib/auth/validateCredentials';
import type { AuthCredentials, AuthUser } from '../types/auth';

seedUsers();

interface AuthState {
  currentUser: AuthUser | null;
  login: (credentials: AuthCredentials) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,

      login: (credentials) => {
        const user = validateCredentials(getUsers(), credentials);
        if (!user) return false;

        set({ currentUser: user });
        return true;
      },

      logout: () => set({ currentUser: null }),
    }),
    {
      name: AUTH_SESSION_STORAGE_KEY,
    },
  ),
);
