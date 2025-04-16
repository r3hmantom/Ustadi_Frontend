"use client";

import React, { useState } from "react";
import { StaggerContainer } from "@/components/ui/animated-elements";
import { CheckCircle2, Clock, Trophy, Sparkles } from "lucide-react";

// Import refactored components
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardStats } from "./components/DashboardStats";
import { TaskManagement } from "./components/TaskManagement";
import { PomodoroTimer } from "./components/PomodoroTimer";
import { Leaderboard } from "./components/Leaderboard";
import { StudySessions } from "./components/StudySessions";
import { FlashcardSection } from "./components/FlashcardSection";
import { QuickActions } from "./components/QuickActions";
import { WeeklyProgress } from "./components/WeeklyProgress";

// Import types
import { StatItem, Task, StudySession, Flashcard, LeaderboardUser } from "./types";

export default function Dashboard() {
  // Mock data for the dashboard
  const stats: StatItem[] = [
    { name: "Completed Tasks", value: 24, icon: <CheckCircle2 className="text-green-500" /> },
    { name: "Study Hours", value: 42, icon: <Clock className="text-blue-500" /> },
    { name: "Points Earned", value: 3250, icon: <Trophy className="text-yellow-500" /> },
    { name: "Current Streak", value: 7, icon: <Sparkles className="text-purple-500" /> }
  ];

  const upcomingTasks: Task[] = [
    { id: 1, title: "Math Assignment", dueDate: "Today", priority: "High", completed: false },
    { id: 2, title: "Physics Revision", dueDate: "Tomorrow", priority: "Medium", completed: false },
    { id: 3, title: "Programming Project", dueDate: "In 3 days", priority: "High", completed: false },
    { id: 4, title: "History Essay Research", dueDate: "Next Week", priority: "Low", completed: false },
  ];

  const completedTasks: Task[] = [
    { id: 5, title: "Chemistry Lab Report", dueDate: "Yesterday", priority: "Medium", completed: true },
    { id: 6, title: "Literature Review", dueDate: "2 days ago", priority: "Medium", completed: true },
  ];

  const studySessions: StudySession[] = [
    { subject: "Mathematics", duration: "45 mins", date: "Today, 10:30 AM" },
    { subject: "Computer Science", duration: "1h 20m", date: "Yesterday, 3:15 PM" },
    { subject: "Physics", duration: "55 mins", date: "Yesterday, 11:00 AM" },
  ];

  const recentFlashcards: Flashcard[] = [
    { id: 1, subject: "Biology", front: "What is photosynthesis?", back: "The process by which green plants use sunlight to synthesize foods from carbon dioxide and water" },
    { id: 2, subject: "History", front: "When did World War II end?", back: "1945" },
    { id: 3, subject: "Chemistry", front: "What is the chemical formula for water?", back: "H₂O" },
  ];

  const leaderboardData: LeaderboardUser[] = [
    { rank: 1, name: "Sarah K.", points: 4250, avatar: "SK" },
    { rank: 2, name: "Michael T.", points: 3890, avatar: "MT" },
    { rank: 3, name: "Abdul Rehman", points: 3250, avatar: "AR" },
    { rank: 4, name: "Lisa W.", points: 3100, avatar: "LW" },
  ];

  return (
    <StaggerContainer>
      <DashboardHeader userName="Abdul Rehman" />
      
      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Management Section */}
        <TaskManagement 
          upcomingTasks={upcomingTasks}
          completedTasks={completedTasks}
        />

        <div>
          {/* Pomodoro Timer */}
          <PomodoroTimer />
          
          {/* Mini Leaderboard */}
          <Leaderboard users={leaderboardData} currentUserName="Abdul Rehman" />
        </div>
      </div>

      {/* Additional Features Row */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Study Sessions */}
        <StudySessions sessions={studySessions} />

        {/* Revision Cards */}
        <FlashcardSection flashcards={recentFlashcards} />

        {/* Quick Actions */}
        <QuickActions />
      </div>
      
      {/* Weekly Progress Chart Placeholder */}
      <WeeklyProgress isLoading={true} />
    </StaggerContainer>
  );
}
