import React from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { StaggerItem } from "@/components/ui/animated-elements";

interface WeeklyProgressProps {
  isLoading?: boolean;
}

export function WeeklyProgress({ isLoading = true }: WeeklyProgressProps) {
  return (
    <StaggerItem className="mt-6">
      <Card className="bg-white overflow-hidden">
        <CardHeader className="border-b-4 border-black">
          <div className="flex items-center justify-between">
            <CardTitle>Weekly Progress</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Tasks</Button>
              <Button variant="outline" size="sm">Time</Button>
              <Button variant="neuPrimary" size="sm">Points</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-64 flex items-center justify-center border-3 border-black rounded-md bg-gray-50">
            {isLoading ? (
              <div className="text-center">
                <Loader2 size={40} className="animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 font-medium">Loading chart data...</p>
              </div>
            ) : (
              <div className="w-full h-full p-4">
                {/* Chart component would go here when data is loaded */}
                <p className="text-center text-gray-500">Chart will be displayed here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </StaggerItem>
  );
}