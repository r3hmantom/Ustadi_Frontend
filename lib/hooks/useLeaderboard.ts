"use client";

import { useEffect } from "react";
import { useLeaderboardStore } from "../stores/useLeaderboardStore";
import { useUserStore } from "../stores/useUserStore";
import { LeaderboardEntry } from "@/db/types";

// DB type has rank_position, frontend store uses rank
interface LeaderboardEntryUI {
  student_id: number;
  student_name: string;
  points: number;
  rank?: number;
  avatar_url?: string;
}

// Combined type to handle both formats
type LeaderboardData = LeaderboardEntryUI & Partial<LeaderboardEntry>;

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
  const userEntry = user
    ? safeLeaderboard.find((entry) => entry.student_id === user.studentId)
    : undefined;
    
  // Map rank_position to rank for consistent interface across the app
  const currentUserRank = userEntry
    ? {
        ...userEntry,
        // Ensure the rank property is available by checking both possible property names
        rank: userEntry.rank || (userEntry as any).rank_position || null
      }
    : undefined;

  // Get top 10 rankings for display
  const topRankings = safeLeaderboard.slice(0, 10);

  return {
    leaderboard: safeLeaderboard as LeaderboardData[],
    topRankings: topRankings as LeaderboardData[],
    currentUserRank: currentUserRank as LeaderboardData | undefined,
    periodType,
    isLoading,
    error,
    fetchLeaderboardData,
    setPeriodType,
    clearError,
  };
}

export default useLeaderboard;
