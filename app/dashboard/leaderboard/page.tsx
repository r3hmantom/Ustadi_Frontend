"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import { useUser } from "@/lib/hooks/useUser";
import { Loader } from "@/components/ui/loader";

const LeaderboardPage = () => {
  const { user } = useUser();
  const { leaderboard, isLoading, error, periodType, setPeriodType } =
    useLeaderboard();

  const handleTabChange = (value: string) => {
    setPeriodType(value as "Daily" | "Weekly" | "Monthly" | "AllTime");
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

      <Tabs value={periodType} onValueChange={handleTabChange}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="Weekly">Weekly</TabsTrigger>
            <TabsTrigger value="Monthly">Monthly</TabsTrigger>
          </TabsList>
          <p className="text-sm text-muted-foreground">
            Points are earned by completing tasks, quizzes, and study sessions
          </p>
        </div>

        <TabsContent value="Weekly">
          <LeaderboardTable
            data={leaderboard}
            loading={isLoading}
            error={error}
            currentUserId={user?.studentId}
            periodType="Weekly"
          />
        </TabsContent>

        <TabsContent value="Monthly">
          <LeaderboardTable
            data={leaderboard}
            loading={isLoading}
            error={error}
            currentUserId={user?.studentId}
            periodType="Monthly"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface LeaderboardTableProps {
  data: any[];
  loading: boolean;
  error: string | null;
  currentUserId?: number;
  periodType: "Daily" | "Weekly" | "Monthly" | "AllTime";
}

const LeaderboardTable = ({
  data,
  loading,
  error,
  currentUserId,
  periodType,
}: LeaderboardTableProps) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center py-8">
          <Loader size="small" text="Loading leaderboard data..." />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-muted-foreground">
            No leaderboard data available yet
          </p>
          <p className="text-center text-sm">
            Complete tasks and quizzes to earn points and appear on the
            leaderboard!
          </p>
        </div>
      </Card>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getPeriodLabel = (entry: any) => {
    const startDate = new Date(entry.start_date);

    if (entry.period_type === "Weekly") {
      return `Week of ${formatDate(startDate)}`;
    } else {
      return new Date(startDate).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-muted text-muted-foreground text-sm">
        {periodType === "Weekly" ? "Weekly" : "Monthly"} Leaderboard - Top
        Students
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left font-medium">Rank</th>
              <th className="p-4 text-left font-medium">Student</th>
              <th className="p-4 text-left font-medium">Period</th>
              <th className="p-4 text-right font-medium">Points</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr
                key={entry.entry_id}
                className={`border-b hover:bg-muted/50 transition-colors ${
                  currentUserId === entry.student_id ? "bg-primary/10" : ""
                }`}
              >
                <td className="p-4">
                  {entry.rank === 1 && (
                    <Badge className="bg-yellow-500 text-primary-foreground">
                      🏆 1st
                    </Badge>
                  )}
                  {entry.rank === 2 && (
                    <Badge className="bg-slate-400 text-primary-foreground">
                      🥈 2nd
                    </Badge>
                  )}
                  {entry.rank === 3 && (
                    <Badge className="bg-amber-600 text-primary-foreground">
                      🥉 3rd
                    </Badge>
                  )}
                  {entry.rank > 3 && (
                    <span className="text-muted-foreground">
                      {entry.rank}th
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      {entry.student_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="font-medium">
                      {entry.student_name || "Unknown User"}
                      {currentUserId === entry.student_id && (
                        <Badge className="ml-2 bg-primary text-primary-foreground">
                          You
                        </Badge>
                      )}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">
                  {getPeriodLabel(entry)}
                </td>
                <td className="p-4 text-right font-bold">{entry.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default LeaderboardPage;
