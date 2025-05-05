import { NextResponse, NextRequest } from "next/server";
import { executeQuery } from "@/db/utils";

/**
 * POST /api/quizzes/questions
 * Creates a new MCQ question for a quiz.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required field validation
    if (
      !body.quiz_id ||
      !body.content ||
      !body.option_a ||
      !body.option_b ||
      !body.option_c ||
      !body.option_d ||
      !body.correct_answer
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              "Missing required fields: quiz_id, content, option_a, option_b, option_c, option_d, and correct_answer",
          },
        },
        { status: 400 }
      );
    }

    // Validate correct answer format
    const validOptions = ["a", "b", "c", "d"];
    if (!validOptions.includes(body.correct_answer)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              "Invalid correct_answer. Must be one of: a, b, c, d",
          },
        },
        { status: 400 }
      );
    }

    // Build query with consistent parameter naming
    const query = `
      INSERT INTO Questions (
        quiz_id, question_type, content, option_a, option_b, option_c, option_d, correct_answer
      )
      OUTPUT INSERTED.*
      VALUES (
        @quizId, 'MCQ', @content, @optionA, @optionB, @optionC, @optionD, @correctAnswer
      );
    `;

    // Map request body to params with consistent camelCase naming
    const params = {
      quizId: body.quiz_id,
      content: body.content,
      optionA: body.option_a,
      optionB: body.option_b,
      optionC: body.option_c,
      optionD: body.option_d,
      correctAnswer: body.correct_answer,
    };

    const result = await executeQuery(query, params);

    if (result.success && result.data && result.data.length > 0) {
      return NextResponse.json(
        { success: true, data: result.data[0] },
        { status: 201 }
      );
    } else {
      const errorMessage = result.success
        ? "Question creation succeeded but no data returned"
        : result.error?.message || "Unknown database error";

      return NextResponse.json(
        { success: false, error: { message: errorMessage } },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing POST /api/quizzes/questions:", error);

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
