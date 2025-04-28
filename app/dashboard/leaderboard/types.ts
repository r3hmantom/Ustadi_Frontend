// Leaderboard user type extended from the existing LeaderboardUser type
export type LeaderboardUserExtended = {
  rank: number;
  userId: number;
  name: string;
  points: number;
  avatar: string;
  weeklyChange?: number; // Points change from previous week
  badges?: string[]; // Achievement badges
};

// Type for leaderboard time periods
export type LeaderboardPeriod = 'Weekly' | 'Monthly' | 'AllTime';

// Type for leaderboard filters
export type LeaderboardFilter = {
  period: LeaderboardPeriod;
  category?: string; // e.g., "Task Completion", "Study Time", "Quizzes"
};

// Type for leaderboard entry from the database
export type LeaderboardEntry = {
  entry_id: number;
  student_id: number;
  period_type: string;
  start_date: string;
  end_date: string;
  points: number;
  rank_position: number;
};

// Type for activity that contributes to leaderboard points
export type PointActivity = {
  id: number;
  student_id: number;
  activity_type: string;
  activity_date: string;
  points_earned: number;
  description: string;
};