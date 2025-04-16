import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeaderboardFilter, LeaderboardPeriod } from "../types";

interface LeaderboardFiltersProps {
  filter: LeaderboardFilter;
  onFilterChange: (filter: LeaderboardFilter) => void;
}

const LeaderboardFilters = ({ filter, onFilterChange }: LeaderboardFiltersProps) => {
  const periods: LeaderboardPeriod[] = ["Weekly", "Monthly", "AllTime"];
  const categories = ["All", "Task Completion", "Study Time", "Quizzes", "Revisions"];

  return (
    <Card className="border-2 border-black">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <p className="font-bold text-sm">Time Period</p>
            <div className="flex gap-2">
              {periods.map((period) => (
                <Button
                  key={period}
                  variant={filter.period === period ? "default" : "outline"}
                  className={filter.period === period ? "bg-black text-white" : ""}
                  onClick={() => onFilterChange({ ...filter, period })}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="font-bold text-sm">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filter.category === category ? "default" : "outline"}
                  className={filter.category === category ? "bg-black text-white" : ""}
                  onClick={() => onFilterChange({ ...filter, category })}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardFilters;