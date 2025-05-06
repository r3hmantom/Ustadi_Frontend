import { NextResponse, NextRequest } from "next/server";
import { executeQuery } from "@/db/utils";
import { LeaderboardEntry } from "@/db/types";
import { getSession } from "../auth/utils";

/**
 * GET /api/leaderboard
 * Fetches leaderboard entries, optionally filtered by period_type
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Unauthorized" },
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const periodType = searchParams.get("period_type") || "Weekly"; // Default to Weekly

    // Validate period_type
    if (!["Weekly", "Monthly"].includes(periodType)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              "Invalid period_type parameter. Must be 'Weekly' or 'Monthly'",
          },
        },
        { status: 400 }
      );
    }

    // Get current date info for filtering
    const now = new Date();

    // Query to fetch leaderboard data
    const query = `
      SELECT l.*, s.full_name as student_name
      FROM Leaderboard l
      JOIN Students s ON l.student_id = s.student_id
      WHERE l.period_type = @periodType
      AND l.end_date >= @now
      ORDER BY l.points DESC, l.student_id ASC
    `;

    const params = {
      periodType,
      now: now.toISOString(),
    };

    const result = await executeQuery<
      LeaderboardEntry & { student_name: string }
    >(query, params);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing GET /api/leaderboard:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leaderboard/update-points
 * Updates a student's points in the leaderboard based on activity
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required field validation
    if (
      !body.student_id ||
      body.points === undefined ||
      body.activity_type === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              "Missing required fields: student_id, points, activity_type",
          },
        },
        { status: 400 }
      );
    }

    const {
      student_id,
      points,
      activity_type,
      related_task_id,
      related_quiz_id,
    } = body;

    // Log the activity first
    const logQuery = `
      INSERT INTO ActivityLog (
        student_id, activity_type, points_earned, related_task_id, related_quiz_id
      )
      VALUES (
        @studentId, @activityType, @pointsEarned, @relatedTaskId, @relatedQuizId
      );
    `;

    const logParams = {
      studentId: student_id,
      activityType: activity_type,
      pointsEarned: points,
      relatedTaskId: related_task_id || null,
      relatedQuizId: related_quiz_id || null,
    };

    await executeQuery(logQuery, logParams);

    // Get current date info for weekly and monthly periods
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    currentWeekEnd.setHours(23, 59, 59, 999);

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    currentMonthEnd.setHours(23, 59, 59, 999);

    // Update weekly leaderboard
    await updateLeaderboard(
      student_id,
      points,
      "Weekly",
      currentWeekStart,
      currentWeekEnd
    );

    // Update monthly leaderboard
    await updateLeaderboard(
      student_id,
      points,
      "Monthly",
      currentMonthStart,
      currentMonthEnd
    );

    return NextResponse.json({
      success: true,
      data: { message: "Points updated successfully" },
    });
  } catch (error) {
    console.error("Error updating leaderboard points:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

async function updateLeaderboard(
  studentId: number,
  points: number,
  periodType: "Weekly" | "Monthly",
  startDate: Date,
  endDate: Date
) {
  // Check if an entry already exists for this student in this period
  const checkQuery = `
    SELECT entry_id, points 
    FROM Leaderboard
    WHERE student_id = @studentId
    AND period_type = @periodType
    AND start_date = @startDate
    AND end_date = @endDate
  `;

  const checkParams = {
    studentId,
    periodType,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };

  const checkResult = await executeQuery(checkQuery, checkParams);

  if (checkResult.success && checkResult.data && checkResult.data.length > 0) {
    // Update existing entry
    const entryId = checkResult.data[0].entry_id;
    const currentPoints = checkResult.data[0].points;
    const newPoints = currentPoints + points;

    const updateQuery = `
      UPDATE Leaderboard
      SET points = @newPoints
      WHERE entry_id = @entryId
    `;

    await executeQuery(updateQuery, {
      newPoints,
      entryId,
    });
  } else {
    // Create new entry
    const insertQuery = `
      INSERT INTO Leaderboard (
        student_id, period_type, start_date, end_date, points
      )
      VALUES (
        @studentId, @periodType, @startDate, @endDate, @points
      );
    `;

    await executeQuery(insertQuery, {
      studentId,
      periodType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      points,
    });
  }

  // Update ranks for all entries in this period
  const updateRanksQuery = `
    WITH RankedEntries AS (
      SELECT 
        entry_id,
        ROW_NUMBER() OVER (ORDER BY points DESC, student_id ASC) AS new_rank
      FROM Leaderboard
      WHERE period_type = @periodType
      AND start_date = @startDate
      AND end_date = @endDate
    )
    UPDATE l
    SET rank_position = r.new_rank
    FROM Leaderboard l
    JOIN RankedEntries r ON l.entry_id = r.entry_id
  `;

  await executeQuery(updateRanksQuery, {
    periodType,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });
}
