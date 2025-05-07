"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  studentId: number;
  fullName: string;
  email: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      fetchUser: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await fetch("/api/auth/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();

          if (data.success) {
            set({
              user: data.data,
              isAuthenticated: true,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
            });
          }
        } catch (err) {
          console.error("Error fetching user:", err);
          set({
            error:
              err instanceof Error ? err.message : "An unknown error occurred",
            user: null,
            isAuthenticated: false,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Failed to logout");
          }

          set({
            user: null,
            isAuthenticated: false,
          });

          // Don't redirect here - let components handle routing
        } catch (err) {
          console.error("Error during logout:", err);
          set({
            error:
              err instanceof Error ? err.message : "An unknown error occurred",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "user-storage", // local storage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
