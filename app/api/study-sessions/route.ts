import { NextRequest, NextResponse } from "next/server";
import {
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
  executeQuery,
} from "@/db/utils";
import { StudySession } from "@/db/types";
import { getSession } from "../auth/utils";

/**
 * GET /api/study-sessions
 * Returns a list of study sessions for the authenticated user
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<StudySession[]>>> {
  try {
    // Check authentication
    const session = await getSession();

    if (!session) {
      return NextResponse.json<ErrorResponse>(
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
    let studentId = studentIdParam ? parseInt(studentIdParam) : undefined;

    // If student_id is not provided or is invalid, use the authenticated user's ID
    if (!studentId || isNaN(studentId)) {
      studentId = session.user.studentId;
    }

    // Ensure that users can only view their own study sessions
    if (studentId !== session.user.studentId) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Unauthorized to access other users' sessions" },
        },
        { status: 403 }
      );
    }

    // Query the database for study sessions
    const query = `
      SELECT session_id, student_id, start_time, end_time, 
             duration_minutes, session_type, task_id
      FROM StudySessions
      WHERE student_id = @studentId
      ORDER BY start_time DESC
    `;

    const result = await executeQuery<StudySession>(query, { studentId });

    if (!result.success) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Failed to fetch study sessions from database" },
        },
        { status: 500 }
      );
    }

    return NextResponse.json<SuccessResponse<StudySession[]>>({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Error fetching study sessions:", error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: { message: "Failed to fetch study sessions" },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/study-sessions
 * Creates a new study session for the authenticated user
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<StudySession>>> {
  try {
    // Check authentication
    const session = await getSession();

    if (!session) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Unauthorized" },
        },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();

    // Validate required fields
    if (!body.session_type || !body.start_time) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: {
            message: "Missing required fields: session_type, start_time",
          },
        },
        { status: 400 }
      );
    }

    // Validate task_id is provided and valid
    if (!body.task_id) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: {
            message: "task_id is required for creating a study session",
          },
        },
        { status: 400 }
      );
    }

    const taskId = parseInt(body.task_id);
    if (isNaN(taskId) || taskId <= 0) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Invalid task_id provided" },
        },
        { status: 400 }
      );
    }

    // Validate session type
    const validSessionTypes = ["Pomodoro", "Revision", "Group Study"];
    if (!validSessionTypes.includes(body.session_type)) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: {
            message: `Invalid session_type. Must be one of: ${validSessionTypes.join(", ")}`,
          },
        },
        { status: 400 }
      );
    }

    // Override student_id with the authenticated user's ID for security
    const studentId = session.user.studentId;

    // Parse dates
    let startTime: Date;
    let endTime: Date | null = null;

    try {
      startTime = new Date(body.start_time);

      if (body.end_time) {
        endTime = new Date(body.end_time);

        if (endTime <= startTime) {
          return NextResponse.json<ErrorResponse>(
            {
              success: false,
              error: { message: "end_time must be after start_time" },
            },
            { status: 400 }
          );
        }
      }
    } catch (e) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Invalid date format" },
        },
        { status: 400 }
      );
    }

    // Insert the new session into the database
    const insertQuery = `
      INSERT INTO StudySessions (
        student_id, start_time, end_time, 
        duration_minutes, session_type, task_id
      )
      OUTPUT INSERTED.*
      VALUES (
        @studentId, @startTime, @endTime, 
        @durationMinutes, @sessionType, @taskId
      )
    `;

    const queryParams = {
      studentId,
      startTime,
      endTime,
      durationMinutes: body.duration_minutes || null,
      sessionType: body.session_type,
      taskId,
    };

    const result = await executeQuery<StudySession>(insertQuery, queryParams);

    if (!result.success) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Failed to create study session in database" },
        },
        { status: 500 }
      );
    }

    if (!result.data || result.data.length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Study session was not created" },
        },
        { status: 500 }
      );
    }

    return NextResponse.json<SuccessResponse<StudySession>>({
      success: true,
      data: result.data[0],
    });
  } catch (error) {
    console.error("Error creating study session:", error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: { message: "Failed to create study session" },
      },
      { status: 500 }
    );
  }
}
