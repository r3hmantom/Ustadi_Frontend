import { NextResponse, NextRequest } from "next/server";
import { executeQuery } from "@/db/utils";

/**
 * GET /api/quizzes/attempts
 * Fetches quiz attempts, filtered by student_id and optionally by quiz_id.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("student_id");
    const quizId = searchParams.get("quiz_id");

    // Student ID is required
    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Missing required student_id parameter" },
        },
        { status: 400 }
      );
    }

    let query = "SELECT * FROM QuizAttempts WHERE student_id = @studentId";
    const params: { [key: string]: unknown } = {
      studentId: parseInt(studentId, 10),
    };

    if (quizId) {
      query += " AND quiz_id = @quizId";
      params.quizId = parseInt(quizId, 10);
    }

    query += " ORDER BY start_time DESC";

    const result = await executeQuery(query, params);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing GET /api/quizzes/attempts:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/quizzes/attempts
 * Creates a new quiz attempt.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required field validation
    if (
      !body.quiz_id ||
      !body.student_id ||
      body.total_questions === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              "Missing required fields: quiz_id, student_id, and total_questions",
          },
        },
        { status: 400 }
      );
    }

    // Build query for creating an attempt
    const query = `
      INSERT INTO QuizAttempts (
        quiz_id, student_id, total_questions
      )
      OUTPUT INSERTED.*
      VALUES (
        @quizId, @studentId, @totalQuestions
      );
    `;

    const params = {
      quizId: body.quiz_id,
      studentId: body.student_id,
      totalQuestions: body.total_questions,
    };

    const result = await executeQuery(query, params);

    if (result.success && result.data && result.data.length > 0) {
      return NextResponse.json(
        { success: true, data: result.data[0] },
        { status: 201 }
      );
    } else {
      const errorMessage = result.success
        ? "Quiz attempt creation succeeded but no data returned"
        : result.error?.message || "Unknown database error";

      return NextResponse.json(
        { success: false, error: { message: errorMessage } },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing POST /api/quizzes/attempts:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid JSON payload" } },
        { status: 400 }
      );
    }

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}
