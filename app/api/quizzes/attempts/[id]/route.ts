import { NextResponse } from "next/server";
import { executeQuery } from "@/db/utils";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/quizzes/attempts/[id]
 * Fetches details of a quiz attempt including questions and answers.
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const attemptId = parseInt(id, 10);

    if (isNaN(attemptId)) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Invalid attempt ID" },
        },
        { status: 400 }
      );
    }

    // Get the attempt details
    const attemptQuery = `
      SELECT * FROM QuizAttempts 
      WHERE attempt_id = @attemptId
    `;
    const attemptResult = await executeQuery(attemptQuery, { attemptId });

    if (
      !attemptResult.success ||
      !attemptResult.data ||
      attemptResult.data.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Quiz attempt not found" },
        },
        { status: 404 }
      );
    }

    const attempt = attemptResult.data[0];

    // Get all answers for this attempt
    const answersQuery = `
      SELECT * FROM QuizAnswers 
      WHERE attempt_id = @attemptId
    `;
    const answersResult = await executeQuery(answersQuery, { attemptId });

    // Get all questions for the quiz
    const questionsQuery = `
      SELECT * FROM Questions 
      WHERE quiz_id = @quizId
    `;
    const questionsResult = await executeQuery(questionsQuery, {
      quizId: attempt.quiz_id,
    });

    return NextResponse.json({
      success: true,
      data: {
        attempt,
        answers: answersResult.success ? answersResult.data : [],
        questions: questionsResult.success ? questionsResult.data : [],
      },
    });
  } catch (error) {
    console.error(
      `Error processing GET /api/quizzes/attempts/${params.id}:`,
      error
    );
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}
