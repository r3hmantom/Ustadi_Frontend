"use client";

import React, { useState } from "react";
import { 
  StaggerContainer, 
  StaggerItem, 
  FadeIn 
} from "@/components/ui/animated-elements";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  Clock, 
  Trophy,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Circle,
  Brain,
  Timer,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  PlusCircle,
  CalendarDays,
  ArrowUpRight,
  BookOpen,
  Users,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function Dashboard() {
  const [pomodoroMode, setPomodoroMode] = useState<"work" | "break">("work");
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ minutes: 25, seconds: 0 });

  // Mock data for the dashboard
  const stats = [
    { name: "Completed Tasks", value: 24, icon: <CheckCircle2 className="text-green-500" /> },
    { name: "Study Hours", value: 42, icon: <Clock className="text-blue-500" /> },
    { name: "Points Earned", value: 3250, icon: <Trophy className="text-yellow-500" /> },
    { name: "Current Streak", value: 7, icon: <Sparkles className="text-purple-500" /> }
  ];

  const upcomingTasks = [
    { id: 1, title: "Math Assignment", dueDate: "Today", priority: "High", completed: false },
    { id: 2, title: "Physics Revision", dueDate: "Tomorrow", priority: "Medium", completed: false },
    { id: 3, title: "Programming Project", dueDate: "In 3 days", priority: "High", completed: false },
    { id: 4, title: "History Essay Research", dueDate: "Next Week", priority: "Low", completed: false },
  ];

  const completedTasks = [
    { id: 5, title: "Chemistry Lab Report", dueDate: "Yesterday", priority: "Medium", completed: true },
    { id: 6, title: "Literature Review", dueDate: "2 days ago", priority: "Medium", completed: true },
  ];

  const studySessions = [
    { subject: "Mathematics", duration: "45 mins", date: "Today, 10:30 AM" },
    { subject: "Computer Science", duration: "1h 20m", date: "Yesterday, 3:15 PM" },
    { subject: "Physics", duration: "55 mins", date: "Yesterday, 11:00 AM" },
  ];

  const recentFlashcards = [
    { id: 1, subject: "Biology", front: "What is photosynthesis?", back: "The process by which green plants use sunlight to synthesize foods from carbon dioxide and water" },
    { id: 2, subject: "History", front: "When did World War II end?", back: "1945" },
    { id: 3, subject: "Chemistry", front: "What is the chemical formula for water?", back: "H₂O" },
  ];

  const leaderboardData = [
    { rank: 1, name: "Sarah K.", points: 4250, avatar: "SK" },
    { rank: 2, name: "Michael T.", points: 3890, avatar: "MT" },
    { rank: 3, name: "Abdul Rehman", points: 3250, avatar: "AR" },
    { rank: 4, name: "Lisa W.", points: 3100, avatar: "LW" },
  ];

  const renderPriorityBadge = (priority: string) => {
    switch(priority) {
      case "High":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-md border-2 border-red-700 text-xs font-bold">
            <ArrowUp size={12} /> {priority}
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md border-2 border-yellow-700 text-xs font-bold">
            {priority}
          </span>
        );
      case "Low":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md border-2 border-blue-700 text-xs font-bold">
            <ArrowDown size={12} /> {priority}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md border-2 border-gray-700 text-xs font-bold">
            {priority}
          </span>
        );
    }
  };

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    if (pomodoroMode === "work") {
      setTimeLeft({ minutes: 25, seconds: 0 });
    } else {
      setTimeLeft({ minutes: 5, seconds: 0 });
    }
  };

  const switchMode = () => {
    setTimerRunning(false);
    if (pomodoroMode === "work") {
      setPomodoroMode("break");
      setTimeLeft({ minutes: 5, seconds: 0 });
    } else {
      setPomodoroMode("work");
      setTimeLeft({ minutes: 25, seconds: 0 });
    }
  };

  const formatTimeLeft = () => {
    return `${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`;
  };

  return (
    <StaggerContainer>
      <StaggerItem>
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Abdul Rehman! Here's an overview of your study progress.</p>
        </div>
      </StaggerItem>

      {/* Stats Overview */}
      <StaggerItem>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white p-2">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.name}</p>
                  <p className="text-3xl font-black">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border-3 border-black">
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </StaggerItem>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Management Section */}
        <StaggerItem className="lg:col-span-2">
          <Card className="bg-white">
            <CardHeader className="border-b-4 border-black">
              <div className="flex items-center justify-between">
                <CardTitle>Task Management</CardTitle>
                <Button variant="neuPrimary" size="sm" className="gap-1">
                  <PlusCircle size={16} /> New Task
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="upcoming">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <div className="mt-6">
                  <TabsContent value="upcoming">
                    {upcomingTasks.length > 0 ? (
                      <ul className="space-y-4">
                        {upcomingTasks.map(task => (
                          <li key={task.id} className="flex items-center p-3 rounded-md border-3 border-black bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <div className="mr-3">
                              {task.completed ? (
                                <CheckCircle size={20} className="text-green-500" />
                              ) : (
                                <Circle size={20} className="text-gray-300" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold">{task.title}</p>
                              <div className="flex items-center gap-2 text-sm mt-1">
                                <CalendarDays size={14} className="text-gray-500" />
                                <span className="text-gray-500">Due: {task.dueDate}</span>
                                {renderPriorityBadge(task.priority)}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500">No upcoming tasks</p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="completed">
                    {completedTasks.length > 0 ? (
                      <ul className="space-y-4">
                        {completedTasks.map(task => (
                          <li key={task.id} className="flex items-center p-3 rounded-md border-3 border-black bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <div className="mr-3">
                              <CheckCircle size={20} className="text-green-500" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold line-through opacity-70">{task.title}</p>
                              <div className="flex items-center gap-2 text-sm mt-1">
                                <CalendarDays size={14} className="text-gray-500" />
                                <span className="text-gray-500">Was due: {task.dueDate}</span>
                                {renderPriorityBadge(task.priority)}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500">No completed tasks yet</p>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
            <CardFooter className="border-t border-gray-200">
              <Button variant="ghost" className="w-full font-bold">View All Tasks</Button>
            </CardFooter>
          </Card>
        </StaggerItem>

        {/* Pomodoro Timer */}
        <StaggerItem>
          <Card className={`${pomodoroMode === "work" ? "bg-red-100" : "bg-green-100"} overflow-hidden`}>
            <CardHeader className={`${pomodoroMode === "work" ? "bg-red-400" : "bg-green-400"} border-b-4 border-black`}>
              <CardTitle className="flex items-center gap-2 text-black">
                <Timer size={20} /> Pomodoro Timer
              </CardTitle>
              <CardDescription className="text-black font-medium">
                {pomodoroMode === "work" ? "Work Session" : "Break Time"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="w-48 h-48 rounded-full border-8 border-black flex items-center justify-center mb-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-4xl font-black">{formatTimeLeft()}</span>
              </div>
              <div className="flex gap-3 mb-4">
                <Button
                  variant={pomodoroMode === "work" ? "neuPrimary" : "neuSecondary"}
                  onClick={toggleTimer}
                  className="gap-2"
                >
                  {timerRunning ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
                  {timerRunning ? "Pause" : "Start"}
                </Button>
                <Button
                  variant="neuSecondary"
                  onClick={resetTimer}
                  className="gap-2"
                >
                  <RotateCcw size={18} />
                  Reset
                </Button>
              </div>
              <Button
                variant="ghost"
                onClick={switchMode}
                className="font-bold"
              >
                Switch to {pomodoroMode === "work" ? "Break" : "Work"} Mode
              </Button>
            </CardContent>
          </Card>

          {/* Mini Leaderboard */}
          <Card className="bg-[#FFD600] mt-6">
            <CardHeader className="border-b-4 border-black">
              <CardTitle className="flex items-center gap-2">
                <Trophy size={20} /> Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {leaderboardData.map((user) => (
                  <li key={user.rank} className={`flex items-center p-3 rounded-md border-3 ${user.rank <= 3 ? "border-black bg-white" : "border-black/50 bg-gray-50"} ${user.name === "Abdul Rehman" ? "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" : ""}`}>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 border-2 border-black font-bold">
                      {user.rank}
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center mr-3 border-2 border-black">
                        <span className="font-bold">{user.avatar}</span>
                      </div>
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-sm">{user.points} points</p>
                      </div>
                    </div>
                    {user.name === "Abdul Rehman" && (
                      <span className="inline-flex bg-black text-white px-2 py-1 rounded text-xs font-bold">
                        You
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="border-t border-black">
              <Button variant="ghost" className="w-full font-bold">Full Leaderboard</Button>
            </CardFooter>
          </Card>
        </StaggerItem>
      </div>

      {/* Additional Features Row */}
      <StaggerItem className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Study Sessions */}
          <Card className="bg-white">
            <CardHeader className="border-b-4 border-black">
              <CardTitle className="flex items-center gap-2">
                <Clock size={20} /> Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="divide-y">
                {studySessions.map((session, index) => (
                  <li key={index} className="py-3 flex justify-between">
                    <div>
                      <p className="font-bold">{session.subject}</p>
                      <p className="text-sm text-gray-500">{session.date}</p>
                    </div>
                    <span className="font-mono font-bold">{session.duration}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="border-t border-gray-200">
              <Button variant="ghost" className="w-full font-bold">View All Sessions</Button>
            </CardFooter>
          </Card>

          {/* Revision Cards */}
          <Card className="bg-white">
            <CardHeader className="border-b-4 border-black">
              <CardTitle className="flex items-center gap-2">
                <Brain size={20} /> Flashcards
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentFlashcards.map((card) => (
                  <div key={card.id} className="border-3 border-black p-3 rounded-md bg-pink-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer">
                    <p className="font-bold text-sm mb-1">{card.subject}</p>
                    <p className="font-medium">{card.front}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-200 flex justify-between">
              <Button variant="ghost" className="font-bold">Study Now</Button>
              <Button variant="neuPrimary" size="sm">
                <PlusCircle size={16} className="mr-1" /> Create
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white">
            <CardHeader className="border-b-4 border-black">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <Button variant="neuPrimary" className="w-full justify-start gap-2">
                  <PlusCircle size={18} /> Create New Task
                </Button>
                <Button variant="neuSecondary" className="w-full justify-start gap-2">
                  <BookOpen size={18} /> Start a Quiz
                </Button>
                <Button variant="neubrutalism" className="w-full justify-start gap-2">
                  <Users size={18} /> Join Group Study
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ArrowUpRight size={18} /> Share Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </StaggerItem>
      
      {/* Weekly Progress Chart Placeholder */}
      <StaggerItem className="mt-6">
        <Card className="bg-white overflow-hidden">
          <CardHeader className="border-b-4 border-black">
            <div className="flex items-center justify-between">
              <CardTitle>Weekly Progress</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Tasks</Button>
                <Button variant="outline" size="sm">Time</Button>
                <Button variant="neuPrimary" size="sm">Points</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64 flex items-center justify-center border-3 border-black rounded-md bg-gray-50">
              <div className="text-center">
                <Loader2 size={40} className="animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 font-medium">Loading chart data...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerContainer>
  );
}
