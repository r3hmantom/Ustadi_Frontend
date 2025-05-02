import { NextResponse, NextRequest } from "next/server";
import { executeQuery } from "@/db/utils";

/**
 * GET /api/tasks/{id}
 * Fetches a specific task by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id, 10);

    if (isNaN(taskId)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid task ID" } },
        { status: 400 }
      );
    }

    const query = "SELECT * FROM Tasks WHERE task_id = @taskId";
    const queryParams = { taskId };

    const result = await executeQuery(query, queryParams);

    if (result.success && result.data && result.data.length > 0) {
      return NextResponse.json(
        { success: true, data: result.data[0] },
        { status: 200 }
      );
    } else if (result.success) {
      return NextResponse.json(
        { success: false, error: { message: "Task not found" } },
        { status: 404 }
      );
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing GET /api/tasks/{id}:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tasks/{id}
 * Updates an existing task.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id, 10);

    if (isNaN(taskId)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid task ID" } },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Build dynamic update query based on provided fields
    const updates: string[] = [];
    const queryParams: Record<string, unknown> = { taskId };

    // Only include fields that are provided in the update
    if (body.title !== undefined) {
      updates.push("title = @title");
      queryParams.title = body.title;
    }

    if (body.description !== undefined) {
      updates.push("description = @description");
      queryParams.description = body.description;
    }

    if (body.due_date !== undefined) {
      updates.push("due_date = @dueDate");
      queryParams.dueDate = body.due_date ? new Date(body.due_date) : null;
    }

    if (body.priority !== undefined) {
      updates.push("priority = @priority");
      queryParams.priority = body.priority;
    }

    if (body.recurrence_pattern !== undefined) {
      updates.push("recurrence_pattern = @recurrencePattern");
      queryParams.recurrencePattern = body.recurrence_pattern;
    }

    if (body.parent_task_id !== undefined) {
      updates.push("parent_task_id = @parentTaskId");
      queryParams.parentTaskId = body.parent_task_id;
    }

    if (body.is_recurring !== undefined) {
      updates.push("is_recurring = @isRecurring");
      queryParams.isRecurring = body.is_recurring;
    }

    if (body.completed_at !== undefined) {
      updates.push("completed_at = @completedAt");
      queryParams.completedAt = body.completed_at
        ? new Date(body.completed_at)
        : null;
    }

    // If no valid fields were provided
    if (updates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "No valid fields provided for update" },
        },
        { status: 400 }
      );
    }

    const query = `
      UPDATE Tasks
      SET ${updates.join(", ")}
      OUTPUT INSERTED.*
      WHERE task_id = @taskId;
    `;

    const result = await executeQuery(query, queryParams);

    if (result.success && result.data && result.data.length > 0) {
      return NextResponse.json(
        { success: true, data: result.data[0] },
        { status: 200 }
      );
    } else if (result.success && (!result.data || result.data.length === 0)) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Task not found or not updated" },
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing PATCH /api/tasks/{id}:", error);

    // Handle JSON parsing errors specially
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

/**
 * DELETE /api/tasks/{id}
 * Deletes a task by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id, 10);

    if (isNaN(taskId)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid task ID" } },
        { status: 400 }
      );
    }

    const query = `
      DELETE FROM Tasks
      OUTPUT DELETED.*
      WHERE task_id = @taskId;
    `;
    const queryParams = { taskId };

    const result = await executeQuery(query, queryParams);

    if (result.success && result.data && result.data.length > 0) {
      return NextResponse.json(
        { success: true, data: result.data[0] },
        { status: 200 }
      );
    } else if (result.success && (!result.data || result.data.length === 0)) {
      return NextResponse.json(
        { success: false, error: { message: "Task not found" } },
        { status: 404 }
      );
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing DELETE /api/tasks/{id}:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}
