"use client";

import { useState } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { useRouter } from "next/navigation";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChartPieIcon } from "lucide-react";
import ActivitySummaryCard from "./activity-summary-card";
import ActivityDistributionCard from "./activity-distribution-card";
import StudyTimeCard from "./study-time-card";
import QuizPerformanceCard from "./quiz-performance-card";
import RecentActivitiesCard from "./recent-activities-card";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AnalyticsPage = () => {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [period, setPeriod] = useState<string>("month");

  // Use the analytics hook instead of direct fetching
  const { analytics, isLoading, error, fetchAnalytics } = useAnalytics(period);

  // Redirect to login if user is not logged in (but only after loading is complete)
  if (!userLoading && user === null) {
    router.push("/auth");
    return null;
  }

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[300px]">
        <Loader size="big" text="Loading analytics..." />
      </div>
    );
  }

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    if (user?.studentId) {
      fetchAnalytics(user.studentId, value);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Track your progress and performance
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/dashboard/analytics/study-stats">
            <Button variant="outline" className="flex items-center gap-2">
              <ChartPieIcon className="w-4 h-4" />
              Detailed Study Statistics
            </Button>
          </Link>
          
          <Select value={period} onValueChange={handlePeriodChange}>
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
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ActivitySummaryCard
            data={
              analytics?.activity_summary || {
                total_points: 0,
                activities_completed: 0,
                task_completion_rate: 0,
              }
            }
            isLoading={isLoading}
          />
          <StudyTimeCard
            data={
              analytics?.study_time || {
                total_minutes: 0,
                session_count: 0,
                average_duration: 0,
                by_type: [],
              }
            }
            isLoading={isLoading}
          />
          <QuizPerformanceCard
            data={
              analytics?.quiz_performance || {
                total_attempts: 0,
                average_score: 0,
                quizzes_completed: 0,
              }
            }
            isLoading={isLoading}
          />
          <ActivityDistributionCard
            data={analytics?.activity_distribution || []}
            isLoading={isLoading}
          />
          <RecentActivitiesCard
            data={analytics?.recent_activities || []}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
