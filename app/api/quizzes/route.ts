import { NextResponse, NextRequest } from "next/server";
import { executeQuery } from "@/db/utils";

/**
 * GET /api/quizzes
 * Fetches quizzes, optionally filtered by student_id.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("student_id");

    let query = "SELECT * FROM Quizzes";
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
    console.error("Error processing GET /api/quizzes:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/quizzes
 * Creates a new quiz.
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
      INSERT INTO Quizzes (
        student_id, title, description, is_public
      )
      OUTPUT INSERTED.*
      VALUES (
        @studentId, @title, @description, @isPublic
      );
    `;

    // Map request body to params with consistent camelCase naming
    const params = {
      studentId: body.student_id,
      title: body.title,
      description: body.description ?? null,
      isPublic: body.is_public ?? false,
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
        ? "Quiz creation succeeded but no data returned"
        : result.error?.message || "Unknown database error";

      return NextResponse.json(
        { success: false, error: { message: errorMessage } },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing POST /api/quizzes:", error);

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
