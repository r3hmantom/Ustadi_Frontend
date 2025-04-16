import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LeaderboardUserExtended, LeaderboardPeriod } from "@/app/dashboard/leaderboard/types";

// GET handler for leaderboard data
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get("period") as LeaderboardPeriod || "Weekly";
  const category = searchParams.get("category") || "All";
  
  try {
    // Get dummy data for now
    // In a real implementation, this would fetch from a database based on the schema
    const data = getDummyLeaderboardData(period, category);
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Error in leaderboard API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch leaderboard data"
      },
      { status: 500 }
    );
  }
}

// Dummy data function that simulates database response
function getDummyLeaderboardData(
  period: LeaderboardPeriod = "Weekly",
  category: string = "All"
): LeaderboardUserExtended[] {
  // This would normally come from a database query using the schema structure
  const data: LeaderboardUserExtended[] = [
    {
      rank: 1,
      userId: 1,
      name: "Sarah K.",
      avatar: "SK",
      points: period === "Weekly" ? 520 : period === "Monthly" ? 2100 : 4250,
      weeklyChange: 150,
      badges: ["Consistent", "Task Master", "Quiz Genius"]
    },
    {
      rank: 2,
      userId: 2,
      name: "Michael T.",
      avatar: "MT",
      points: period === "Weekly" ? 490 : period === "Monthly" ? 1890 : 3890,
      weeklyChange: 310,
      badges: ["Study Pro", "Task Master"]
    },
    {
      rank: 3,
      userId: 3,
      name: "Abdul Rehman",
      avatar: "AR",
      points: period === "Weekly" ? 450 : period === "Monthly" ? 1780 : 3250,
      weeklyChange: -50,
      badges: ["Quiz Genius"]
    },
    {
      rank: 4,
      userId: 4,
      name: "Lisa W.",
      avatar: "LW",
      points: period === "Weekly" ? 410 : period === "Monthly" ? 1640 : 3100,
      weeklyChange: 200,
      badges: ["Consistent"]
    },
    {
      rank: 5,
      userId: 5,
      name: "Jake S.",
      avatar: "JS",
      points: period === "Weekly" ? 380 : period === "Monthly" ? 1520 : 2980,
      weeklyChange: 120,
      badges: []
    },
    {
      rank: 6,
      userId: 6,
      name: "Emma P.",
      avatar: "EP",
      points: period === "Weekly" ? 350 : period === "Monthly" ? 1420 : 2830,
      weeklyChange: 0,
      badges: ["Study Pro"]
    },
    {
      rank: 7,
      userId: 7,
      name: "David M.",
      avatar: "DM",
      points: period === "Weekly" ? 310 : period === "Monthly" ? 1350 : 2720,
      weeklyChange: 90,
      badges: []
    },
    {
      rank: 8,
      userId: 8,
      name: "Sophia L.",
      avatar: "SL",
      points: period === "Weekly" ? 290 : period === "Monthly" ? 1280 : 2650,
      weeklyChange: -30,
      badges: ["Task Master"]
    },
    {
      rank: 9,
      userId: 9,
      name: "Daniel B.",
      avatar: "DB",
      points: period === "Weekly" ? 270 : period === "Monthly" ? 1170 : 2510,
      weeklyChange: 50,
      badges: []
    },
    {
      rank: 10,
      userId: 10,
      name: "Olivia J.",
      avatar: "OJ",
      points: period === "Weekly" ? 250 : period === "Monthly" ? 1090 : 2480,
      weeklyChange: 120,
      badges: ["Consistent"]
    }
  ];
  
  // Filter by category if not "All"
  // This simulates database filtering that would happen in a real implementation
  if (category !== "All") {
    // Simple simulation of category filtering
    // In a real implementation, this would filter based on activity types in ActivityLog
    return data.filter((_, index) => index % (category === "Task Completion" ? 2 : 3) === 0);
  }
  
  return data;
}