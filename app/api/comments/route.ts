import { NextResponse, NextRequest } from "next/server";
import { executeQuery } from "@/db/utils";

/**
 * GET /api/comments
 * Fetches comments, optionally filtered by task_id.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("task_id");

    let query = `
      SELECT c.*, s.full_name as student_name 
      FROM Comments c
      JOIN Students s ON c.student_id = s.student_id
    `;
    const params: { [key: string]: unknown } = {};

    if (taskId) {
      const taskIdNum = parseInt(taskId, 10);

      if (isNaN(taskIdNum)) {
        return NextResponse.json(
          {
            success: false,
            error: { message: "Invalid task_id parameter" },
          },
          { status: 400 }
        );
      }

      query += " WHERE c.task_id = @taskId";
      params.taskId = taskIdNum;
    }

    query += " ORDER BY c.created_at ASC";

    const result = await executeQuery(query, params);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing GET /api/comments:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comments
 * Creates a new comment.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required field validation
    if (!body.task_id || !body.student_id || !body.content) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Missing required fields: task_id, student_id, content",
          },
        },
        { status: 400 }
      );
    }

    // Build query with consistent parameter naming
    const query = `
      INSERT INTO Comments (
        task_id, student_id, content, parent_comment_id
      )
      OUTPUT INSERTED.*
      VALUES (
        @taskId, @studentId, @content, @parentCommentId
      );
    `;

    // Map request body to params with consistent camelCase naming
    const params = {
      taskId: body.task_id,
      studentId: body.student_id,
      content: body.content,
      parentCommentId: body.parent_comment_id ?? null,
    };

    const result = await executeQuery(query, params);

    if (result.success && result.data && result.data.length > 0) {
      return NextResponse.json(
        { success: true, data: result.data[0] },
        { status: 201 }
      );
    } else {
      // Handle both no data case and execution error case
      const errorMessage = result.success
        ? "Comment creation succeeded but no data returned"
        : result.error?.message || "Unknown database error";

      return NextResponse.json(
        { success: false, error: { message: errorMessage } },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing POST /api/comments:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid JSON payload" } },
        { status: 400 }
      );
    }

    // Handle all other errors
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}
