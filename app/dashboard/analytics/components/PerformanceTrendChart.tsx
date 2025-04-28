"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceData } from '../types';

interface PerformanceTrendChartProps {
  data: PerformanceData[];
}

export function PerformanceTrendChart({ data }: PerformanceTrendChartProps) {
  // Calculate highest score for graph scaling
  const maxScore = Math.max(...data.map(item => item.score));
  const minScore = Math.min(...data.map(item => item.score));
  const range = maxScore - minScore;
  const buffer = range * 0.1; // Add 10% buffer for better visualization
  
  const graphMin = Math.max(0, minScore - buffer);
  const graphMax = maxScore + buffer;
  const graphRange = graphMax - graphMin;
  
  // Create points for the line graph
  const points = data.map((item, index) => {
    const x = (100 / (data.length - 1)) * index;
    const y = 100 - ((item.score - graphMin) / graphRange) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trend</CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="relative h-[200px] w-full">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f1f1" strokeWidth="0.5" />
            <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f1f1" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f1f1" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="#f1f1f1" strokeWidth="0.5" />
            <line x1="0" y1="100" x2="100" y2="100" stroke="#f1f1f1" strokeWidth="0.5" />
            
            {/* Performance trend line */}
            <polyline
              points={points}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {data.map((item, index) => {
              const x = (100 / (data.length - 1)) * index;
              const y = 100 - ((item.score - graphMin) / graphRange) * 100;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#3b82f6"
                  stroke="#fff"
                  strokeWidth="1"
                />
              );
            })}
          </svg>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
            {data.map((item, index) => (
              <div key={index} style={{ 
                position: 'absolute', 
                left: `${(100 / (data.length - 1)) * index}%`,
                transform: 'translateX(-50%)'
              }}>
                {index % 2 === 0 ? item.week : ''}
              </div>
            ))}
          </div>
          
          {/* Y-axis labels */}
          <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-between text-xs text-gray-500">
            <div>{Math.round(graphMax)}</div>
            <div>{Math.round(graphMin + graphRange * 0.75)}</div>
            <div>{Math.round(graphMin + graphRange * 0.5)}</div>
            <div>{Math.round(graphMin + graphRange * 0.25)}</div>
            <div>{Math.round(graphMin)}</div>
          </div>
        </div>
        
        {/* Average score */}
        <div className="text-center text-sm mt-6">
          <span className="font-medium">Average score: </span>
          {Math.round(data.reduce((sum, item) => sum + item.score, 0) / data.length)}
        </div>
      </CardContent>
    </Card>
  );
}