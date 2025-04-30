import { NextResponse, NextRequest } from "next/server";
import { executeQuery } from "@/db/utils"; // Adjust path as necessary
import { ApiResponse, CreateTaskPayload, TaskDB } from "@/lib/types";

// Define the shape of a Task record (based on schema)
type Task = TaskDB;

/**
 * GET /api/tasks
 * Fetches tasks, optionally filtered by student_id.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("student_id");

  let query = "SELECT * FROM Tasks";
  const params: { [key: string]: unknown } = {};

  if (studentId) {
    query += " WHERE student_id = @studentId";
    params.studentId = parseInt(studentId, 10); // Ensure it's a number
    if (isNaN(params.studentId as number)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid student_id parameter" } },
        { status: 400 }
      );
    }
  }
  query += " ORDER BY created_at DESC"; // Example ordering

  const result: ApiResponse<Task[]> = await executeQuery<Task>(query, params);

  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * POST /api/tasks
 * Creates a new task.
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateTaskPayload = await request.json();

    // Basic validation
    if (!body.student_id || !body.title) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Missing required fields: student_id and title" },
        },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO Tasks (
        student_id, title, description, due_date, priority,
        recurrence_pattern, parent_task_id, is_recurring
      )
      OUTPUT INSERTED.*
      VALUES (
        @student_id, @title, @description, @due_date, @priority,
        @recurrence_pattern, @parent_task_id, @is_recurring
      );
    `;

    const params = {
      student_id: body.student_id,
      title: body.title,
      description: body.description ?? null,
      due_date: body.due_date ? new Date(body.due_date) : null,
      priority: body.priority ?? 3, // Default priority if not provided
      recurrence_pattern: body.recurrence_pattern ?? null,
      parent_task_id: body.parent_task_id ?? null,
      is_recurring: body.is_recurring ?? false, // Default is_recurring
    };

    const result: ApiResponse<Task[]> = await executeQuery<Task>(query, params);

    if (result.success && result.data && result.data.length > 0) {
      // Return the newly created task
      return NextResponse.json(
        { success: true, data: result.data[0] },
        { status: 201 }
      );
    } else if (result.success) {
      // Should not happen with OUTPUT INSERTED.* if insert worked, but handle defensively
      return NextResponse.json(
        {
          success: false,
          error: { message: "Task creation succeeded but no data returned" },
        },
        { status: 500 }
      );
    } else {
      // executeQuery handles logging, just return the formatted error
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing POST /api/tasks:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    // Check for JSON parsing errors specifically
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid JSON payload" } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: { message: message } },
      { status: 500 }
    );
  }
}
