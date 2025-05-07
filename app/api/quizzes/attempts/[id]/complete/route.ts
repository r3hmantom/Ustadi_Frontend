import { NextResponse } from "next/server";
import { executeQuery } from "@/db/utils";
import { awardQuizCompletionPoints } from "@/app/services/leaderboardService";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * PATCH /api/quizzes/attempts/[id]/complete
 * Completes a quiz attempt and calculates the final score.
 */
export async function PATCH(request: Request, { params }: RouteParams) {
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

    // First, check if the attempt exists
    const checkQuery = `SELECT * FROM QuizAttempts WHERE attempt_id = @attemptId`;
    const checkParams = { attemptId };

    const checkResult = await executeQuery(checkQuery, checkParams);

    if (
      !checkResult.success ||
      !checkResult.data ||
      checkResult.data.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Quiz attempt not found" },
        },
        { status: 404 }
      );
    }

    // Check if the attempt is already completed to avoid duplicate points
    const attempt = checkResult.data[0];
    if (attempt.is_completed) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Quiz attempt is already completed" },
        },
        { status: 400 }
      );
    }

    // Calculate the score based on correct answers
    const scoreQuery = `
      SELECT COUNT(*) AS correct_count
      FROM QuizAnswers
      WHERE attempt_id = @attemptId AND is_correct = 1
    `;

    const scoreResult = await executeQuery(scoreQuery, { attemptId });

    if (!scoreResult.success || !scoreResult.data) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Failed to calculate score" },
        },
        { status: 500 }
      );
    }

    const correctCount = scoreResult.data[0]?.correct_count || 0;
    const totalQuestions = checkResult.data[0].total_questions;

    // Update the attempt to mark it as completed with the score
    const updateQuery = `
      UPDATE QuizAttempts
      SET 
        is_completed = 1,
        end_time = GETDATE(),
        score = @score
      OUTPUT INSERTED.*
      WHERE attempt_id = @attemptId
    `;

    const updateParams = {
      attemptId,
      score: correctCount,
    };

    const result = await executeQuery(updateQuery, updateParams);

    if (result.success && result.data && result.data.length > 0) {
      const completedAttempt = result.data[0];

      // Award points for completing the quiz
      try {
        // Award points asynchronously to avoid blocking the response
        awardQuizCompletionPoints(
          completedAttempt.student_id,
          completedAttempt.quiz_id,
          correctCount,
          totalQuestions
        ).catch((err) =>
          console.error("Error awarding quiz completion points:", err)
        );
      } catch (err) {
        // Log error but don't fail the request
        console.error("Error trying to award quiz points:", err);
      }

      return NextResponse.json({
        success: true,
        data: completedAttempt,
      });
    } else {
      const errorMessage = result.success
        ? "Quiz completion succeeded but no data returned"
        : result.error?.message || "Unknown database error";

      return NextResponse.json(
        { success: false, error: { message: errorMessage } },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(
      `Error processing PATCH /api/quizzes/attempts/${params.id}/complete:`,
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
