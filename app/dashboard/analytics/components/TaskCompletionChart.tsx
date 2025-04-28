"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCompletionData } from '../types';

interface TaskCompletionChartProps {
  data: TaskCompletionData;
}

export function TaskCompletionChart({ data }: TaskCompletionChartProps) {
  const { completed, pending, overdue, completionRate } = data;
  const total = completed + pending + overdue;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative h-40 w-40">
            {/* Circle chart showing completion percentage */}
            <svg className="h-full w-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                className="stroke-slate-200"
                cx="50"
                cy="50"
                r="40"
                strokeWidth="10"
                fill="transparent"
              />
              
              {/* Completion progress */}
              <circle
                className="stroke-green-500 transition-all duration-700"
                cx="50"
                cy="50"
                r="40"
                strokeWidth="10"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={`${(completionRate / 100) * 251.2} 251.2`}
                transform="rotate(-90 50 50)"
              />
              
              {/* Percentage text */}
              <text
                x="50"
                y="50"
                dominantBaseline="middle"
                textAnchor="middle"
                className="font-bold text-2xl"
              >
                {completionRate}%
              </text>
            </svg>
          </div>
          
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completed</span>
              <span className="text-green-500 font-medium">{completed}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pending</span>
              <span className="text-amber-500 font-medium">{pending}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Overdue</span>
              <span className="text-red-500 font-medium">{overdue}</span>
            </div>
            <div className="flex justify-between text-sm font-medium pt-2 border-t">
              <span>Total Tasks</span>
              <span>{total}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}