import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, SuccessResponse, ErrorResponse } from "@/db/utils";
import { StudySession } from "@/db/types";
import { getSession } from "../../auth/utils";
import { executeQuery } from "@/db/utils";

/**
 * GET /api/study-sessions/[id]
 * Retrieves a specific study session by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const sessionId = parseInt(params.id);

    if (isNaN(sessionId)) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Invalid session ID" },
        },
        { status: 400 }
      );
    }

    // Query the database for the requested study session
    const query = `
      SELECT session_id, student_id, start_time, end_time, 
             duration_minutes, session_type, task_id
      FROM StudySessions
      WHERE session_id = @sessionId
    `;

    const result = await executeQuery<StudySession>(query, { sessionId });

    if (!result.success) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Failed to fetch study session" },
        },
        { status: 500 }
      );
    }

    if (result.data.length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Study session not found" },
        },
        { status: 404 }
      );
    }

    const studySession = result.data[0];

    // Ensure the user can only access their own sessions
    if (studySession.student_id !== session.user.studentId) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Unauthorized to access this study session" },
        },
        { status: 403 }
      );
    }

    return NextResponse.json<SuccessResponse<StudySession>>({
      success: true,
      data: studySession,
    });
  } catch (error) {
    console.error(`Error fetching study session ${params.id}:`, error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: { message: "Failed to fetch study session" },
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/study-sessions/[id]
 * Updates a specific study session
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const sessionId = parseInt(params.id);

    if (isNaN(sessionId)) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Invalid session ID" },
        },
        { status: 400 }
      );
    }

    // Get the request body
    const body = await request.json();

    // First fetch the existing session to verify ownership
    const getSessionQuery = `
      SELECT session_id, student_id, start_time, end_time, 
             duration_minutes, session_type, task_id
      FROM StudySessions
      WHERE session_id = @sessionId
    `;

    const existingSessionResult = await executeQuery<StudySession>(
      getSessionQuery,
      { sessionId }
    );

    if (!existingSessionResult.success) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Failed to fetch study session" },
        },
        { status: 500 }
      );
    }

    if (existingSessionResult.data.length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Study session not found" },
        },
        { status: 404 }
      );
    }

    const existingSession = existingSessionResult.data[0];

    // Ensure the user can only update their own sessions
    if (existingSession.student_id !== session.user.studentId) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Unauthorized to update this study session" },
        },
        { status: 403 }
      );
    }

    // Enforce session type enum values if provided
    if (body.session_type) {
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
    }

    // Ensure task_id is provided and is a valid number
    if (body.task_id !== undefined) {
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
    }

    // Build the update query dynamically based on the provided fields
    const updateFields = [];
    const queryParams = { sessionId };

    if (body.start_time !== undefined) {
      updateFields.push("start_time = @startTime");
      queryParams.startTime = new Date(body.start_time);
    }

    if (body.end_time !== undefined) {
      updateFields.push("end_time = @endTime");
      queryParams.endTime = body.end_time ? new Date(body.end_time) : null;
    }

    if (body.duration_minutes !== undefined) {
      updateFields.push("duration_minutes = @durationMinutes");
      queryParams.durationMinutes = body.duration_minutes;
    }

    if (body.session_type !== undefined) {
      updateFields.push("session_type = @sessionType");
      queryParams.sessionType = body.session_type;
    }

    if (body.task_id !== undefined) {
      updateFields.push("task_id = @taskId");
      queryParams.taskId = parseInt(body.task_id);
    }

    // If no fields to update, return the existing session
    if (updateFields.length === 0) {
      return NextResponse.json<SuccessResponse<StudySession>>({
        success: true,
        data: existingSession,
      });
    }

    // Build and execute the update query
    const updateQuery = `
      UPDATE StudySessions 
      SET ${updateFields.join(", ")}
      OUTPUT INSERTED.*
      WHERE session_id = @sessionId
    `;

    const updateResult = await executeQuery<StudySession>(
      updateQuery,
      queryParams
    );

    if (!updateResult.success || updateResult.data.length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Failed to update study session" },
        },
        { status: 500 }
      );
    }

    return NextResponse.json<SuccessResponse<StudySession>>({
      success: true,
      data: updateResult.data[0], // Return the updated session directly
    });
  } catch (error) {
    console.error(`Error updating study session ${params.id}:`, error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: { message: "Failed to update study session" },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/study-sessions/[id]
 * Deletes a specific study session
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const sessionId = parseInt((await params).id);

    if (isNaN(sessionId)) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Invalid session ID" },
        },
        { status: 400 }
      );
    }

    // First fetch the existing session to verify ownership
    const getSessionQuery = `
      SELECT session_id, student_id, start_time, end_time, 
             duration_minutes, session_type, task_id
      FROM StudySessions
      WHERE session_id = @sessionId
    `;

    const existingSessionResult = await executeQuery<StudySession>(
      getSessionQuery,
      { sessionId }
    );

    if (!existingSessionResult.success) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Failed to fetch study session" },
        },
        { status: 500 }
      );
    }

    if (existingSessionResult.data.length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Study session not found" },
        },
        { status: 404 }
      );
    }

    const existingSession = existingSessionResult.data[0];

    // Ensure the user can only delete their own sessions
    if (existingSession.student_id !== session.user.studentId) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Unauthorized to delete this study session" },
        },
        { status: 403 }
      );
    }

    // Delete the session from the database
    const deleteQuery = `
      DELETE FROM StudySessions
      OUTPUT DELETED.*
      WHERE session_id = @sessionId
    `;

    const deleteResult = await executeQuery<StudySession>(deleteQuery, {
      sessionId,
    });

    if (!deleteResult.success) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Failed to delete study session" },
        },
        { status: 500 }
      );
    }

    if (deleteResult.data.length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Study session not found or not deleted" },
        },
        { status: 404 }
      );
    }

    return NextResponse.json<SuccessResponse<StudySession>>({
      success: true,
      data: deleteResult.data[0],
    });
  } catch (error) {
    console.error(`Error deleting study session ${params.id}:`, error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: { message: "Failed to delete study session" },
      },
      { status: 500 }
    );
  }
}
