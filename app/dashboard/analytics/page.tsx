"use client";

import React, { useEffect, useState } from 'react';
import { StudyTimeChart } from './components/StudyTimeChart';
import { TaskCompletionChart } from './components/TaskCompletionChart';
import { SubjectDistributionChart } from './components/SubjectDistributionChart';
import { PerformanceTrendChart } from './components/PerformanceTrendChart';
import { AnalyticsData } from './types';
import { StaggerContainer } from '@/components/ui/animated-elements';
import { Card, CardContent } from '@/components/ui/card';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalyticsData() {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics');
        
        if (!response.ok) {
          throw new Error(`Error fetching analytics: ${response.status}`);
        }
        
        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 mb-2">⚠️ {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  const { 
    studyTimeOverview, 
    taskCompletionRates, 
    subjectDistribution, 
    performanceOverTime,
    streakData 
  } = analyticsData;

  return (
    <StaggerContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Your Analytics</h1>
        <p className="text-muted-foreground">
          Track your progress and study patterns over time
        </p>
      </div>

      {/* Current streak information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-bold text-primary">
                {streakData.currentStreak} Days
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Current Streak
              </p>
              <div className="text-sm mt-4">
                <span className="font-medium">Longest Streak:</span> {streakData.longestStreak} Days
              </div>
              <div className="text-sm">
                <span className="font-medium">Last Active:</span> {new Date(streakData.lastActiveDate).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Time Chart */}
        <StudyTimeChart data={studyTimeOverview} />
      </div>

      {/* Main analytics section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <TaskCompletionChart data={taskCompletionRates} />
        <PerformanceTrendChart data={performanceOverTime} />
        <SubjectDistributionChart data={subjectDistribution} />
      </div>

      {/* Future sections can be added here */}
    </StaggerContainer>
  );
}