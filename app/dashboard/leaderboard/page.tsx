"use client";

import React, { useState } from "react";
import { StaggerContainer } from "@/components/ui/animated-elements";
import { Trophy } from "lucide-react";
import { LeaderboardPeriod, LeaderboardFilter } from "./types";
import LeaderboardTable from "./components/LeaderboardTable";
import LeaderboardFilters from "./components/LeaderboardFilters";
import TopAchievers from "./components/TopAchievers";
import PointsBreakdown from "./components/PointsBreakdown";

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<LeaderboardFilter>({
    period: 'Weekly',
    category: 'All'
  });
  
  return (
    <StaggerContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="text-yellow-500" size={28} /> Leaderboard
          </h1>
        </div>
        
        <LeaderboardFilters filter={filter} onFilterChange={setFilter} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LeaderboardTable filter={filter} />
          </div>
          <div className="space-y-6">
            <TopAchievers />
            <PointsBreakdown />
          </div>
        </div>
      </div>
    </StaggerContainer>
  );
}