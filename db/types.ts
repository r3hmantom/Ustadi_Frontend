// Database types based on schema.sql

// Import the response types from utils to avoid duplication
import { ApiResponse, SuccessResponse, ErrorResponse } from "./utils";

// Re-export the response types to make them available from the types module
export type { ApiResponse, SuccessResponse, ErrorResponse };

// For internal use when mapping database results to models
export interface Student {
  student_id: number;
  email: string;
  password: string;
  full_name: string | null;
  registration_date: Date;
  last_login: Date | null;
  is_active: number | boolean; // SQL bit type can be represented as number (0/1) or boolean
}

// Client-facing user type (excludes sensitive fields)
export interface UserProfile {
  studentId: number;
  email: string;
  fullName: string | null;
  registrationDate?: Date;
  lastLogin?: Date | null;
  isActive?: boolean;
}

export interface Task {
  task_id: number;
  student_id: number;
  title: string;
  description: string | null;
  due_date: Date | null;
  priority: number;
  recurrence_pattern: string | null;
  parent_task_id: number | null;
  created_at: Date;
  completed_at: Date | null;
  is_recurring: number | boolean;
}

export interface TaskTag {
  tag_id: number;
  tag_name: string;
}

export interface TaskTagMapping {
  task_id: number;
  tag_id: number;
}

export interface Attachment {
  attachment_id: number;
  task_id: number;
  file_name: string;
  file_path: string;
  uploaded_at: Date;
}

export interface StudySession {
  session_id: number;
  student_id: number;
  start_time: Date;
  end_time: Date | null;
  duration_minutes: number | null;
  session_type: "Pomodoro" | "Revision" | "Group Study";
  task_id: number | null;
}

export interface Comment {
  comment_id: number;
  task_id: number;
  student_id: number;
  content: string;
  created_at: Date;
  parent_comment_id: number | null;
}

export interface Flashcard {
  flashcard_id: number;
  student_id: number;
  front_content: string;
  back_content: string;
  next_review_date: Date;
  interval_days: number;
  ease_factor: number;
  created_at: Date;
}

export interface Quiz {
  quiz_id: number;
  student_id: number;
  title: string;
  description: string | null;
  created_at: Date;
  is_public: number | boolean;
}

export interface Question {
  question_id: number;
  quiz_id: number;
  question_type: "MCQ"; // Only MCQ is allowed
  content: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "a" | "b" | "c" | "d"; // Now represents the letter of the correct option
}

export interface QuizAttempt {
  attempt_id: number;
  quiz_id: number;
  student_id: number;
  start_time: Date;
  end_time: Date | null;
  score: number | null;
  total_questions: number;
  is_completed: number | boolean;
}

export interface QuizAnswer {
  answer_id: number;
  attempt_id: number;
  question_id: number;
  selected_option: "a" | "b" | "c" | "d";
  is_correct: number | boolean;
}

export interface Group {
  group_id: number;
  group_name: string;
  created_by: number;
  created_at: Date;
  is_active: number | boolean;
}

export interface GroupMember {
  group_id: number;
  student_id: number;
  joined_at: Date;
  role: "Member" | "Leader";
}

export interface LeaderboardEntry {
  entry_id: number;
  student_id: number;
  period_type: "Weekly" | "Monthly";
  start_date: Date;
  end_date: Date;
  points: number;
  rank_position: number | null;
}

export interface ActivityLog {
  log_id: number;
  student_id: number;
  activity_type: string;
  activity_date: Date;
  points_earned: number;
  related_task_id: number | null;
  related_quiz_id: number | null;
  related_session_id: number | null;
}
