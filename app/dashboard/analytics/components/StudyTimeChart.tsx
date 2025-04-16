"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudyTimeData } from '../types';

interface StudyTimeChartProps {
  data: StudyTimeData[];
}

export function StudyTimeChart({ data }: StudyTimeChartProps) {
  // Get the maximum study time to scale the chart
  const maxMinutes = Math.max(...data.map(item => item.minutes));
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Study Time Overview (Last 14 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <div className="flex h-full items-end space-x-2">
            {data.map((item, index) => {
              const height = (item.minutes / maxMinutes) * 100;
              const date = new Date(item.date);
              const day = date.getDate();
              const month = date.toLocaleString('default', { month: 'short' });
              
              return (
                <div key={index} className="relative flex h-full w-full flex-col justify-end">
                  <div 
                    className="bg-blue-500 rounded-t-md w-full transition-all duration-500" 
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 -mb-6 text-xs text-center">
                      {day} {index === 0 || day === 1 ? month : ""}
                    </div>
                  </div>
                  {index % 2 === 0 && (
                    <div className="absolute -top-6 left-0 right-0 text-xs text-center text-gray-500">
                      {item.minutes} min
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-8">
          Total: {data.reduce((sum, item) => sum + item.minutes, 0)} minutes
        </div>
      </CardContent>
    </Card>
  );
}