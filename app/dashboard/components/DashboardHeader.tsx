import React from "react";
import { StaggerItem } from "@/components/ui/animated-elements";

interface DashboardHeaderProps {
  userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <StaggerItem>
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {userName}! Here's an overview of your study progress.</p>
      </div>
    </StaggerItem>
  );
}