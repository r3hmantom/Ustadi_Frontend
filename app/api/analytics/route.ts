import { NextResponse } from "next/server";
import { addDays, format, subDays } from "date-fns";

// Types for the analytics data
export interface AnalyticsData {
  studyTimeOverview: StudyTimeData[];
  taskCompletionRates: TaskCompletionData;
  subjectDistribution: SubjectDistributionData[];
  performanceOverTime: PerformanceData[];
  streakData: StreakData;
}

export interface StudyTimeData {
  date: string;
  minutes: number;
}

export interface TaskCompletionData {
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}

export interface SubjectDistributionData {
  subject: string;
  minutesSpent: number;
  percentage: number;
}

export interface PerformanceData {
  week: string;
  score: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

// Generate dummy data for the analytics
function generateDummyAnalyticsData(): AnalyticsData {
  // Generate study time data for the last 14 days
  const studyTimeOverview: StudyTimeData[] = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i);
    return {
      date: format(date, "yyyy-MM-dd"),
      minutes: Math.floor(Math.random() * 180) + 30, // Random minutes between 30-210
    };
  });

  // Task completion stats
  const completed = Math.floor(Math.random() * 30) + 40; // 40-70 tasks
  const pending = Math.floor(Math.random() * 20) + 10; // 10-30 tasks
  const overdue = Math.floor(Math.random() * 10) + 5; // 5-15 tasks
  const total = completed + pending + overdue;
  
  const taskCompletionRates: TaskCompletionData = {
    completed,
    pending,
    overdue,
    completionRate: Math.round((completed / total) * 100),
  };

  // Subject distribution data
  const subjects = ["Mathematics", "Physics", "Computer Science", "History", "Biology", "Chemistry", "Literature"];
  const totalMinutes = 3600; // Total minutes across all subjects
  
  const subjectDistribution: SubjectDistributionData[] = subjects.map(subject => {
    const minutesSpent = Math.floor(Math.random() * 800) + 200; // 200-1000 minutes per subject
    return {
      subject,
      minutesSpent,
      percentage: Math.round((minutesSpent / totalMinutes) * 100),
    };
  });

  // Performance over time (last 8 weeks)
  const performanceOverTime: PerformanceData[] = Array.from({ length: 8 }, (_, i) => {
    const weekNumber = 8 - i;
    return {
      week: `Week ${weekNumber}`,
      score: Math.floor(Math.random() * 40) + 60, // Score between 60-100
    };
  });

  // Streak data
  const streakData: StreakData = {
    currentStreak: Math.floor(Math.random() * 7) + 3, // 3-10 days
    longestStreak: Math.floor(Math.random() * 10) + 15, // 15-25 days
    lastActiveDate: format(new Date(), "yyyy-MM-dd"),
  };

  return {
    studyTimeOverview,
    taskCompletionRates,
    subjectDistribution,
    performanceOverTime,
    streakData,
  };
}

export async function GET() {
  // In a real implementation, you would fetch this data from the database
  // based on the authenticated user
  
  /* Example of how to replace this with real database queries:
  
  import { db } from "@/lib/db";
  
  // Get authenticated user ID (using your auth system)
  const userId = auth.getUserId();
  
  // Fetch study session data
  const studyTimeOverview = await db.query(`
    SELECT 
      CONVERT(date, start_time) as date, 
      SUM(duration_minutes) as minutes
    FROM StudySessions
    WHERE student_id = ?
    GROUP BY CONVERT(date, start_time)
    ORDER BY date DESC
    LIMIT 14
  `, [userId]);
  
  // Fetch task completion data
  const tasks = await db.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN completed_at IS NOT NULL THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN completed_at IS NULL AND due_date > GETDATE() THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN completed_at IS NULL AND due_date < GETDATE() THEN 1 ELSE 0 END) as overdue
    FROM Tasks
    WHERE student_id = ?
  `, [userId]);
  
  */

  // For now, return dummy data
  const analyticsData = generateDummyAnalyticsData();
  
  return NextResponse.json(analyticsData);
}