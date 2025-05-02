import { NextResponse, NextRequest } from "next/server";
import { executeQuery } from "@/db/utils";

/**
 * GET /api/tasks
 * Fetches tasks, optionally filtered by student_id.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("student_id");

    let query = "SELECT * FROM Tasks";
    const params: { [key: string]: unknown } = {};

    if (studentId) {
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

      query += " WHERE student_id = @studentId";
      params.studentId = studentIdNum;
    }

    query += " ORDER BY created_at DESC";

    const result = await executeQuery(query, params);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing GET /api/tasks:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks
 * Creates a new task.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required field validation
    if (!body.student_id || !body.title) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Missing required fields: student_id and title" },
        },
        { status: 400 }
      );
    }

    // Build query with consistent parameter naming
    const query = `
      INSERT INTO Tasks (
        student_id, title, description, due_date, priority,
        recurrence_pattern, parent_task_id, is_recurring
      )
      OUTPUT INSERTED.*
      VALUES (
        @studentId, @title, @description, @dueDate, @priority,
        @recurrencePattern, @parentTaskId, @isRecurring
      );
    `;

    // Map request body to params with consistent camelCase naming
    const params = {
      studentId: body.student_id,
      title: body.title,
      description: body.description ?? null,
      dueDate: body.due_date ? new Date(body.due_date) : null,
      priority: body.priority ?? 3,
      recurrencePattern: body.recurrence_pattern ?? null,
      parentTaskId: body.parent_task_id ?? null,
      isRecurring: body.is_recurring ?? false,
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
        ? "Task creation succeeded but no data returned"
        : result.error?.message || "Unknown database error";

      return NextResponse.json(
        { success: false, error: { message: errorMessage } },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing POST /api/tasks:", error);

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
