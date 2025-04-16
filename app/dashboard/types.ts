import { ReactNode } from "react";

export type StatItem = {
  name: string;
  value: number;
  icon: ReactNode;
};

export type Task = {
  id: number;
  title: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
};

export type StudySession = {
  subject: string;
  duration: string;
  date: string;
};

export type Flashcard = {
  id: number;
  subject: string;
  front: string;
  back: string;
};

export type LeaderboardUser = {
  rank: number;
  name: string;
  points: number;
  avatar: string;
};

export type PomodoroSettings = {
  pomodoroMode: "work" | "break";
  timerRunning: boolean;
  timeLeft: { minutes: number; seconds: number };
  muted: boolean;
  completedSessions: number;
};