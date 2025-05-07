"use client";

import { create } from "zustand";
import { fetchLeaderboard } from "@/app/services/leaderboardService";

type PeriodType = "Daily" | "Weekly" | "Monthly" | "AllTime";

interface LeaderboardEntry {
  student_id: number;
  student_name: string;
  points: number;
  rank: number;
  avatar_url?: string;
}

interface LeaderboardState {
  leaderboard: LeaderboardEntry[];
  periodType: PeriodType;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchLeaderboardData: (period?: PeriodType) => Promise<void>;
  setPeriodType: (period: PeriodType) => void;
  clearError: () => void;
}

export const useLeaderboardStore = create<LeaderboardState>()((set, get) => ({
  leaderboard: [],
  periodType: "Weekly",
  isLoading: false,
  error: null,

  fetchLeaderboardData: async (period) => {
    try {
      set({ isLoading: true, error: null });

      const periodToUse = period || get().periodType;
      const response = await fetchLeaderboard(periodToUse);

      // Ensure we have an array of leaderboard entries
      const leaderboardData =
        response && response.data && Array.isArray(response.data)
          ? response.data
          : [];

      set({
        leaderboard: leaderboardData,
        periodType: periodToUse,
      });
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      set({
        leaderboard: [], // Ensure leaderboard is an empty array on error
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setPeriodType: (period) => {
    set({ periodType: period });
    get().fetchLeaderboardData(period);
  },

  clearError: () => set({ error: null }),
}));
