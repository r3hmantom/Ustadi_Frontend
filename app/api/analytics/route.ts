import { NextResponse, NextRequest } from "next/server";
import { executeQuery } from "@/db/utils";
import { getSession } from "../auth/utils";

/**
 * GET /api/analytics
 * Fetches analytics data for the authenticated user
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

    // Get student_id from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const studentIdParam = searchParams.get("student_id");
    const period = searchParams.get("period") || "month"; // Default to month

    let studentId = studentIdParam ? parseInt(studentIdParam) : undefined;

    // If student_id is not provided or is invalid, use the authenticated user's ID
    if (!studentId || isNaN(studentId)) {
      studentId = session.user.studentId;
    }

    // Ensure that users can only view their own analytics
    if (studentId !== session.user.studentId) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Unauthorized to access other users' analytics" },
        },
        { status: 403 }
      );
    }

    // Calculate dates based on period
    const now = new Date();
    let startDate = new Date();

    if (period === "week") {
      startDate.setDate(now.getDate() - 7);
    } else if (period === "month") {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === "year") {
      startDate.setFullYear(now.getFullYear() - 1);
    } else if (period === "all") {
      startDate = new Date(0); // Beginning of time
    } else {
      // Default to month
      startDate.setMonth(now.getMonth() - 1);
    }

    // Convert dates to ISO string format
    const startDateStr = startDate.toISOString();
    const nowStr = now.toISOString();

    // Query for activity summary
    const activitySummaryQuery = `
      SELECT 
        ISNULL(SUM(points_earned), 0) as total_points,
        COUNT(*) as activities_completed,
        (
          SELECT CAST(COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) AS FLOAT) / 
                 NULLIF(COUNT(*), 0) 
          FROM Tasks 
          WHERE student_id = @studentId 
          AND created_at >= @startDate
        ) as task_completion_rate
      FROM ActivityLog
      WHERE student_id = @studentId
      AND activity_date >= @startDate
    `;

    // Query for activity distribution
    const activityDistributionQuery = `
      SELECT 
        activity_type,
        COUNT(*) as count,
        SUM(points_earned) as points
      FROM ActivityLog
      WHERE student_id = @studentId
      AND activity_date >= @startDate
      GROUP BY activity_type
      ORDER BY count DESC
    `;

    // Query for study time data
    const studyTimeQuery = `
      SELECT 
        ISNULL(SUM(duration_minutes), 0) as total_minutes,
        COUNT(*) as session_count,
        ISNULL(AVG(duration_minutes), 0) as average_duration
      FROM StudySessions
      WHERE student_id = @studentId
      AND start_time >= @startDate
    `;

    // Query for study time by type
    const studyTimeByTypeQuery = `
      SELECT 
        session_type as type,
        ISNULL(SUM(duration_minutes), 0) as minutes
      FROM StudySessions
      WHERE student_id = @studentId
      AND start_time >= @startDate
      GROUP BY session_type
    `;

    // Query for quiz performance
    const quizPerformanceQuery = `
      SELECT 
        COUNT(*) as total_attempts,
        ISNULL(AVG(CAST(score AS FLOAT) / NULLIF(total_questions, 0) * 100), 0) as average_score,
        SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) as quizzes_completed
      FROM QuizAttempts
      WHERE student_id = @studentId
      AND start_time >= @startDate
    `;

    // Query for recent activities
    const recentActivitiesQuery = `
      SELECT TOP 10
        a.activity_type,
        a.activity_date,
        a.points_earned,
        CASE 
          WHEN a.activity_type = 'task_completion' THEN (SELECT title FROM Tasks WHERE task_id = a.related_task_id)
          WHEN a.activity_type = 'quiz_completion' THEN (SELECT title FROM Quizzes WHERE quiz_id = a.related_quiz_id)
          WHEN a.activity_type = 'study_session' THEN (
            SELECT 
              CONCAT(
                session_type, ' (', 
                CONVERT(VARCHAR, duration_minutes), ' mins)'
              ) 
            FROM StudySessions 
            WHERE session_id = a.related_session_id
          )
          ELSE a.activity_type
        END as description
      FROM ActivityLog a
      WHERE a.student_id = @studentId
      ORDER BY a.activity_date DESC
    `;

    // Execute all queries in parallel
    const [
      activitySummaryResult,
      activityDistributionResult,
      studyTimeResult,
      studyTimeByTypeResult,
      quizPerformanceResult,
      recentActivitiesResult,
    ] = await Promise.all([
      executeQuery(activitySummaryQuery, {
        studentId,
        startDate: startDateStr,
      }),
      executeQuery(activityDistributionQuery, {
        studentId,
        startDate: startDateStr,
      }),
      executeQuery(studyTimeQuery, { studentId, startDate: startDateStr }),
      executeQuery(studyTimeByTypeQuery, {
        studentId,
        startDate: startDateStr,
      }),
      executeQuery(quizPerformanceQuery, {
        studentId,
        startDate: startDateStr,
      }),
      executeQuery(recentActivitiesQuery, { studentId }),
    ]);

    // Check for query failures
    if (
      !activitySummaryResult.success ||
      !activityDistributionResult.success ||
      !studyTimeResult.success ||
      !studyTimeByTypeResult.success ||
      !quizPerformanceResult.success ||
      !recentActivitiesResult.success
    ) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Failed to fetch analytics data" },
        },
        { status: 500 }
      );
    }

    // Combine all data
    const analyticsData = {
      activity_summary: activitySummaryResult.data[0] || {
        total_points: 0,
        activities_completed: 0,
        task_completion_rate: 0,
      },
      activity_distribution: activityDistributionResult.data || [],
      study_time: {
        ...(studyTimeResult.data[0] || {
          total_minutes: 0,
          session_count: 0,
          average_duration: 0,
        }),
        by_type: studyTimeByTypeResult.data || [],
      },
      quiz_performance: quizPerformanceResult.data[0] || {
        total_attempts: 0,
        average_score: 0,
        quizzes_completed: 0,
      },
      recent_activities: recentActivitiesResult.data || [],
    };

    return NextResponse.json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    console.error("Error processing GET /api/analytics:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}
