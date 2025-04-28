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