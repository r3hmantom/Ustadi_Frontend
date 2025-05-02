import { NextResponse, NextRequest } from "next/server";
import { executeQuery } from "@/db/utils";

/**
 * POST /api/quizzes/questions
 * Creates a new question for a quiz.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required field validation
    if (
      !body.quiz_id ||
      !body.content ||
      !body.question_type ||
      !body.correct_answer
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              "Missing required fields: quiz_id, content, question_type, and correct_answer",
          },
        },
        { status: 400 }
      );
    }

    // Validate question type
    const validQuestionTypes = ["MCQ", "Short Answer", "Long Answer"];
    if (!validQuestionTypes.includes(body.question_type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              "Invalid question_type. Must be one of: MCQ, Short Answer, Long Answer",
          },
        },
        { status: 400 }
      );
    }

    // Build query with consistent parameter naming
    const query = `
      INSERT INTO Questions (
        quiz_id, question_type, content, correct_answer
      )
      OUTPUT INSERTED.*
      VALUES (
        @quizId, @questionType, @content, @correctAnswer
      );
    `;

    // Map request body to params with consistent camelCase naming
    const params = {
      quizId: body.quiz_id,
      questionType: body.question_type,
      content: body.content,
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
