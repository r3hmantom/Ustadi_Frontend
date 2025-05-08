"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface StudentStatistics {
  totalCompletedTasks: number;
  totalStudyMinutes: number;
  averageSessionMinutes: number;
  totalStudySessions: number;
  taskCompletionByPriority: { priority: number; CompletedCount: number }[];
  totalPointsEarned: number;
}

export default function StudyStatsPage() {
  const [statistics, setStatistics] = useState<StudentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState(1); // Default student ID, could be from session/context

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await api.get<StudentStatistics>(`/api/study-statistics?student_id=${studentId}`);
        setStatistics(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch study statistics:", err);
        setError("Failed to load statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [studentId]);

  // Format minutes into hours and minutes
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Prepare data for the priority chart
  const preparePriorityData = (data: { priority: number; CompletedCount: number }[] | undefined) => {
    if (!data) return [];
    
    return data.map(item => ({
      priority: `Priority ${item.priority}`,
      count: item.CompletedCount
    }));
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Study Statistics</h1>
      <p className="text-gray-500 mb-8">
        View your study progress and performance metrics. This data is generated from our SQL stored procedure.
      </p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Completed Tasks</CardTitle>
                <CardDescription>Total tasks you've finished</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statistics?.totalCompletedTasks || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Study Time</CardTitle>
                <CardDescription>Cumulative time spent studying</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatMinutes(statistics?.totalStudyMinutes || 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Sessions</CardTitle>
                <CardDescription>Number of sessions recorded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statistics?.totalStudySessions || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avg. Session Length</CardTitle>
                <CardDescription>Your typical study session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatMinutes(Math.round(statistics?.averageSessionMinutes || 0))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Points</CardTitle>
                <CardDescription>Points earned from activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statistics?.totalPointsEarned || 0}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Task Completion by Priority</CardTitle>
              <CardDescription>Number of tasks completed in each priority level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={preparePriorityData(statistics?.taskCompletionByPriority)}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="priority" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Completed Tasks" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 