import { NextResponse, NextRequest } from "next/server";
import { executeQuery } from "@/db/utils";
import sql from "mssql";
import { getConnection } from "@/db/db";

/**
 * GET /api/study-statistics
 * Fetches study statistics for a student using a stored procedure
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("student_id");

    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Missing required parameter: student_id" },
        },
        { status: 400 }
      );
    }

    const studentIdNum = parseInt(studentId, 10);

    if (isNaN(studentIdNum)) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Invalid student_id parameter" },
        },
        { status: 400 }
      );
    }

    // Use the stored procedure
    const dbRequest = await getConnection();
    dbRequest.input('StudentId', sql.Int, studentIdNum);
    
    const result = await dbRequest.execute('GetStudentStudyStatistics');
    
    if (!result) {
      return NextResponse.json(
        { 
          success: false, 
          error: { message: "Failed to retrieve study statistics" } 
        },
        { status: 500 }
      );
    }

    // Extract data from the multiple result sets
    const statistics = {
      totalCompletedTasks: result.recordsets[0][0].TotalCompletedTasks,
      totalStudyMinutes: result.recordsets[1][0].TotalStudyMinutes,
      averageSessionMinutes: result.recordsets[2][0].AverageSessionMinutes,
      totalStudySessions: result.recordsets[3][0].TotalStudySessions,
      taskCompletionByPriority: result.recordsets[4],
      totalPointsEarned: result.recordsets[5][0].TotalPointsEarned,
    };

    return NextResponse.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error("Error processing GET /api/study-statistics:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
} 