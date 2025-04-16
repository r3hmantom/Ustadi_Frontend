import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StaggerItem } from "@/components/ui/animated-elements";
import { StatItem } from "../types";

interface DashboardStatsProps {
  stats: StatItem[];
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
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
  );
}