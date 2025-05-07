"use client";

import { useUser } from "@/lib/hooks/useUser";
import { useTask } from "@/lib/hooks/useTask";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import { useFlashcard } from "@/lib/hooks/useFlashcard";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { CheckCircle, BookOpen, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const DashboardPage = () => {
  const { user, isAuthenticated, loading: userLoading } = useUser();
  const { activeTasks, isLoading: tasksLoading } = useTask();
  const { analytics, isLoading: analyticsLoading } = useAnalytics("week");
  const { currentUserRank, isLoading: leaderboardLoading } = useLeaderboard();
  const { flashcards, isLoading: flashcardsLoading } = useFlashcard();

  if (userLoading || !isAuthenticated) {
    return (
      <div className="container py-6">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-muted-foreground">
            {userLoading
              ? "Loading..."
              : "Please log in to view your dashboard"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your recent activity and progress
          </p>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card key="tasks-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasksLoading ? "..." : activeTasks.length}
            </div>
            <p className="text-xs text-muted-foreground">Active tasks</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link href="/dashboard/tasks">
                <span>View all tasks</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card key="flashcards-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Flashcards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {flashcardsLoading ? "..." : flashcards.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Flashcards to review
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link href="/dashboard/revisions">
                <span>Practice now</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card key="study-time-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Study time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsLoading
                ? "..."
                : analytics?.study_time?.total_minutes
                  ? `${Math.round(analytics.study_time.total_minutes / 60)}h`
                  : "0h"}
            </div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link href="/dashboard/analytics">
                <span>View analytics</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card key="ranking-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaderboardLoading
                ? "..."
                : currentUserRank && currentUserRank.rank
                  ? `#${currentUserRank.rank}`
                  : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Weekly leaderboard</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link href="/dashboard/leaderboard">
                <span>View leaderboard</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks section */}
        <Card className="col-span-1" key="tasks-section-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-primary" />
              Recent Tasks
            </CardTitle>
            <CardDescription>Your most recent active tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="py-4 text-center text-muted-foreground">
                Loading tasks...
              </div>
            ) : activeTasks.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No tasks</AlertTitle>
                <AlertDescription>
                  You don&apos;t have any active tasks. Create one to get
                  started.
                </AlertDescription>
              </Alert>
            ) : (
              <ul className="space-y-3">
                {activeTasks.slice(0, 5).map((task, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      {task.due_date && (
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/dashboard/tasks?id=${task?.id as string}`}>
                        View
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/tasks">View all tasks</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Flashcards section */}
        <Card className="col-span-1" key="flashcards-section-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              Flashcards to Review
            </CardTitle>
            <CardDescription>
              Review your flashcards to improve retention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {flashcardsLoading ? (
              <div className="py-4 text-center text-muted-foreground">
                Loading flashcards...
              </div>
            ) : flashcards.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No flashcards</AlertTitle>
                <AlertDescription>
                  You don&apos;t have any flashcards. Create one to get started.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {flashcards.slice(0, 3).map((card, idx) => (
                  <div
                    key={idx}
                    className="p-3 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <p className="font-medium">{card.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {card.category || "Uncategorized"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/revisions">Practice flashcards</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
