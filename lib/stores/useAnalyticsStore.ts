"use client";

import { create } from "zustand";
import { fetchAnalyticsDashboard } from "@/app/services/analyticsService";
import { useUserStore } from "./useUserStore";

interface AnalyticsSummary {
  total_points: number;
  activities_completed: number;
  task_completion_rate: number;
}

interface ActivityType {
  type: string;
  count: number;
}

interface StudyTime {
  total_minutes: number;
  session_count: number;
  average_duration: number;
  by_type: Array<{ type: string; minutes: number }>;
}

interface QuizPerformance {
  total_attempts: number;
  average_score: number;
  quizzes_completed: number;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  timestamp: string;
  details: string;
}

interface Analytics {
  activity_summary: AnalyticsSummary;
  activity_distribution: ActivityType[];
  study_time: StudyTime;
  quiz_performance: QuizPerformance;
  recent_activities: Activity[];
}

interface AnalyticsState {
  analytics: Analytics | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAnalytics: (studentId?: number, period?: string) => Promise<void>;
  clearError: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>()((set) => ({
  analytics: null,
  isLoading: false,
  error: null,

  fetchAnalytics: async (studentId, period) => {
    try {
      set({ isLoading: true, error: null });

      if (!studentId) {
        const user = useUserStore.getState().user;
        if (!user) {
          throw new Error("User ID is required to fetch analytics");
        }
        studentId = user.studentId;
      }

      const analytics = await fetchAnalyticsDashboard(studentId, period);

      set({ analytics });
    } catch (err) {
      console.error("Error fetching analytics:", err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
