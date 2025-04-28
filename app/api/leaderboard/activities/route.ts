import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PointActivity } from "@/app/dashboard/leaderboard/types";

// GET handler for point activities
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const studentId = searchParams.get("studentId");
  
  try {
    // Get dummy data for now
    // In a real implementation, this would fetch from a database based on the schema
    const data = getDummyActivityData(studentId ? parseInt(studentId) : undefined);
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Error in activity logs API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch activity data"
      },
      { status: 500 }
    );
  }
}

// Dummy function that simulates database response for activities
function getDummyActivityData(studentId?: number): PointActivity[] {
  // This would normally be fetched from the ActivityLog table using SQL
  const activities: PointActivity[] = [
    {
      id: 101,
      student_id: 3, // Default to current user (Abdul Rehman)
      activity_type: "Task Completion",
      activity_date: "2025-04-16T10:30:00",
      points_earned: 10,
      description: "Completed Math Assignment"
    },
    {
      id: 102,
      student_id: 3,
      activity_type: "Study Session",
      activity_date: "2025-04-16T14:15:00",
      points_earned: 15,
      description: "90-minute study session"
    },
    {
      id: 103,
      student_id: 3,
      activity_type: "Quiz",
      activity_date: "2025-04-15T16:20:00",
      points_earned: 25,
      description: "Perfect score on Physics quiz"
    },
    {
      id: 104,
      student_id: 3,
      activity_type: "Daily Revision",
      activity_date: "2025-04-15T09:45:00",
      points_earned: 15,
      description: "Completed daily revision cards"
    },
    {
      id: 105,
      student_id: 3,
      activity_type: "Task Completion",
      activity_date: "2025-04-14T11:10:00",
      points_earned: 10,
      description: "Completed Literature Review"
    },
    {
      id: 106,
      student_id: 3,
      activity_type: "Weekly Bonus",
      activity_date: "2025-04-12T00:00:00",
      points_earned: 50,
      description: "Top 3 finish in weekly leaderboard"
    },
    {
      id: 107,
      student_id: 1,
      activity_type: "Monthly Bonus",
      activity_date: "2025-04-01T00:00:00",
      points_earned: 100,
      description: "First place in monthly leaderboard"
    }
  ];
  
  // If studentId is provided, filter activities for that student
  if (studentId !== undefined) {
    return activities.filter(activity => activity.student_id === studentId);
  }
  
  return activities;
}