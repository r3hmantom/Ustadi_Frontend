"use client";

import React, { useState, useEffect } from "react";
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
  // State for flashcards from API
  const [dashboardFlashcards, setDashboardFlashcards] = useState<Flashcard[]>([]);
  const [flashcardsLoading, setFlashcardsLoading] = useState(true);

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

  const leaderboardData: LeaderboardUser[] = [
    { rank: 1, name: "Sarah K.", points: 4250, avatar: "SK" },
    { rank: 2, name: "Michael T.", points: 3890, avatar: "MT" },
    { rank: 3, name: "Abdul Rehman", points: 3250, avatar: "AR" },
    { rank: 4, name: "Lisa W.", points: 3100, avatar: "LW" },
  ];

  // Fetch flashcards for the dashboard
  useEffect(() => {
    const fetchFlashcards = async () => {
      setFlashcardsLoading(true);
      try {
        // Fetch only a few flashcards for the dashboard preview
        const response = await fetch('/api/revisions?student_id=1&limit=3');
        if (!response.ok) {
          throw new Error('Failed to fetch flashcards');
        }
        
        const data = await response.json();
        
        // Transform API flashcards to match dashboard Flashcard type
        const transformedFlashcards: Flashcard[] = data.map((card: any) => ({
          id: card.flashcard_id,
          subject: card.tags?.[0] || "General",
          front: card.front_content,
          back: card.back_content
        }));
        
        setDashboardFlashcards(transformedFlashcards);
      } catch (error) {
        console.error('Error fetching flashcards for dashboard:', error);
        // Set empty array on error
        setDashboardFlashcards([]);
      } finally {
        setFlashcardsLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

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

        {/* Revision Cards - Now fetched from API */}
        <FlashcardSection flashcards={dashboardFlashcards} />

        {/* Quick Actions */}
        <QuickActions />
      </div>
      
      {/* Weekly Progress Chart */}
      <WeeklyProgress isLoading={false} />
    </StaggerContainer>
  );
}
