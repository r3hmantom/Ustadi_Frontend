"use client";

import { ReactNode, useEffect } from "react";
import { useUserStore } from "@/lib/stores/useUserStore";
import { useTaskStore } from "@/lib/stores/useTaskStore";
import { useAnalyticsStore } from "@/lib/stores/useAnalyticsStore";
import { useFlashcardStore } from "@/lib/stores/useFlashcardStore";
import { useQuizStore } from "@/lib/stores/useQuizStore";
import { useLeaderboardStore } from "@/lib/stores/useLeaderboardStore";

interface StoreProviderProps {
  children: ReactNode;
}

/**
 * Provider component that initializes all Zustand stores
 * and ensures they're properly hydrated
 */
export function StoreProvider({ children }: StoreProviderProps) {
  const { fetchUser, user } = useUserStore();
  const { fetchTasks } = useTaskStore();
  const { fetchAnalytics } = useAnalyticsStore();
  const { fetchFlashcards } = useFlashcardStore();
  const { fetchQuizzes } = useQuizStore();
  const { fetchLeaderboardData } = useLeaderboardStore();

  // Initialize user data on app load - this is essential and should be first
  useEffect(() => {
    try {
      fetchUser();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [fetchUser]);

  // Once user is loaded, fetch initial data for all stores
  useEffect(() => {
    if (user?.studentId) {
      // Wait for user data to be available before fetching other data
      const fetchAllData = async () => {
        try {
          await Promise.allSettled([
            fetchTasks(user.studentId),
            fetchAnalytics(user.studentId),
            fetchFlashcards(user.studentId),
            fetchQuizzes(user.studentId),
            fetchLeaderboardData(),
          ]);
        } catch (error) {
          console.error("Error initializing store data:", error);
        }
      };

      fetchAllData();
    }
  }, [
    user,
    fetchTasks,
    fetchAnalytics,
    fetchFlashcards,
    fetchQuizzes,
    fetchLeaderboardData,
  ]);

  return <>{children}</>;
}
