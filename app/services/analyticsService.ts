import { toast } from "sonner";

// Types for analytics data
export interface ActivitySummary {
  total_points: number;
  activities_completed: number;
  task_completion_rate: number;
}

export interface ActivityDistribution {
  activity_type: string;
  count: number;
  points: number;
}

export interface StudyTimeData {
  total_minutes: number;
  session_count: number;
  average_duration: number;
  by_type: {
    type: string;
    minutes: number;
  }[];
}

export interface QuizPerformance {
  total_attempts: number;
  average_score: number;
  quizzes_completed: number;
}

export interface AnalyticsDashboard {
  activity_summary: ActivitySummary;
  activity_distribution: ActivityDistribution[];
  study_time: StudyTimeData;
  quiz_performance: QuizPerformance;
  recent_activities: {
    activity_type: string;
    activity_date: string;
    points_earned: number;
    description: string;
  }[];
}

// Helper for API requests
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.error?.message || "An unknown error occurred";
    throw new Error(errorMessage);
  }

  if (!data.success) {
    throw new Error(data.error?.message || "Operation failed");
  }

  return data.data;
};

// Analytics API functions
export const fetchAnalyticsDashboard = async (
  studentId: number,
  period?: string
): Promise<AnalyticsDashboard> => {
  try {
    const url = new URL("/api/analytics", window.location.origin);

    // Add query parameters
    url.searchParams.append("student_id", studentId.toString());
    if (period) {
      url.searchParams.append("period", period);
    }

    const response = await fetch(url.toString());
    return await handleResponse<AnalyticsDashboard>(response);
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    toast.error("Failed to load analytics data");
    throw error;
  }
};
