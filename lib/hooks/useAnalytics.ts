"use client";

import { useEffect } from "react";
import { useAnalyticsStore } from "../stores/useAnalyticsStore";
import { useUserStore } from "../stores/useUserStore";

export function useAnalytics(period?: string) {
  const { analytics, isLoading, error, fetchAnalytics, clearError } =
    useAnalyticsStore();

  const { user } = useUserStore();
  const studentId = user?.studentId;

  useEffect(() => {
    if (studentId) {
      fetchAnalytics(studentId, period);
    }
  }, [studentId, period, fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    fetchAnalytics,
    clearError,
  };
}

export default useAnalytics;
