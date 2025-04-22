import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // API call to /api/auth/login
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to login');
          }

          const data = await response.json();
          set({ user: data.user, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // API call to /api/auth/register
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to register');
          }

          const data = await response.json();
          set({ user: data.user, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
      },

      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage', // name of the item in storage
      // Only store the user, not the loading state or error
      partialize: (state) => ({ user: state.user }),
    }
  )
);