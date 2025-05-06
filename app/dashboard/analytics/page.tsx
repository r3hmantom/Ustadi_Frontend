"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchAnalyticsDashboard,
  AnalyticsDashboard,
} from "@/app/services/analyticsService";
import ActivitySummaryCard from "./activity-summary-card";
import ActivityDistributionCard from "./activity-distribution-card";
import StudyTimeCard from "./study-time-card";
import QuizPerformanceCard from "./quiz-performance-card";
import RecentActivitiesCard from "./recent-activities-card";

const AnalyticsPage = () => {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDashboard | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("month");

  // Load analytics data when user data is available or period changes
  useEffect(() => {
    const loadAnalyticsData = async () => {
      if (!user?.studentId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await fetchAnalyticsDashboard(user.studentId, period);
        setAnalyticsData(data);
      } catch (err) {
        console.error("Failed to load analytics data", err);
        setError("Failed to load analytics data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [user?.studentId, period]);

  // Redirect to login if user is not logged in (but only after loading is complete)
  useEffect(() => {
    if (!userLoading && user === null) {
      router.push("/auth");
    }
  }, [user, userLoading, router]);

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[300px]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Track your progress and performance
          </p>
        </div>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ActivitySummaryCard
            data={
              analyticsData?.activity_summary || {
                total_points: 0,
                activities_completed: 0,
                task_completion_rate: 0,
              }
            }
            isLoading={loading}
          />
          <StudyTimeCard
            data={
              analyticsData?.study_time || {
                total_minutes: 0,
                session_count: 0,
                average_duration: 0,
                by_type: [],
              }
            }
            isLoading={loading}
          />
          <QuizPerformanceCard
            data={
              analyticsData?.quiz_performance || {
                total_attempts: 0,
                average_score: 0,
                quizzes_completed: 0,
              }
            }
            isLoading={loading}
          />
          <ActivityDistributionCard
            data={analyticsData?.activity_distribution || []}
            isLoading={loading}
          />
          <RecentActivitiesCard
            data={analyticsData?.recent_activities || []}
            isLoading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
