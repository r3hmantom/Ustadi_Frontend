"use client";

import { useEffect } from "react";
import { useLeaderboardStore } from "../stores/useLeaderboardStore";
import { useUserStore } from "../stores/useUserStore";

export function useLeaderboard() {
  const {
    leaderboard,
    periodType,
    isLoading,
    error,
    fetchLeaderboardData,
    setPeriodType,
    clearError,
  } = useLeaderboardStore();

  const { user } = useUserStore();

  // Fetch leaderboard data when the hook is first initialized
  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  // Ensure leaderboard is an array
  const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];

  // Find the current user in the leaderboard
  const currentUserRank = user
    ? safeLeaderboard.find((entry) => entry.student_id === user.studentId)
    : undefined;

  // Get top 10 rankings for display
  const topRankings = safeLeaderboard.slice(0, 10);

  return {
    leaderboard: safeLeaderboard,
    topRankings,
    currentUserRank,
    periodType,
    isLoading,
    error,
    fetchLeaderboardData,
    setPeriodType,
    clearError,
  };
}

export default useLeaderboard;
