"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectDistributionData } from '../types';

interface SubjectDistributionChartProps {
  data: SubjectDistributionData[];
}

export function SubjectDistributionChart({ data }: SubjectDistributionChartProps) {
  // Sort data by minutes spent in descending order
  const sortedData = [...data].sort((a, b) => b.minutesSpent - a.minutesSpent);
  
  // Generate different colors for each subject
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 
    'bg-pink-500', 'bg-teal-500', 'bg-orange-500'
  ];
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Subject Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedData.map((item, index) => (
            <div key={item.subject} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{item.subject}</span>
                <span>{item.minutesSpent} mins ({item.percentage}%)</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500`} 
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}