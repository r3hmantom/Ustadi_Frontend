import { NextResponse, NextRequest } from "next/server";
import { executeQuery } from "@/db/utils";

/**
 * POST /api/quizzes/attempts/answer
 * Submits an answer for a quiz attempt and checks if it's correct.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required field validation
    if (!body.attempt_id || !body.question_id || !body.selected_option) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              "Missing required fields: attempt_id, question_id, and selected_option",
          },
        },
        { status: 400 }
      );
    }

    // Validate selected option
    const validOptions = ["a", "b", "c", "d"];
    if (!validOptions.includes(body.selected_option)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid selected_option. Must be one of: a, b, c, d",
          },
        },
        { status: 400 }
      );
    }

    // First, get the correct answer for the question
    const getQuestionQuery = `
      SELECT correct_answer 
      FROM Questions 
      WHERE question_id = @questionId
    `;

    const questionParams = {
      questionId: body.question_id,
    };

    const questionResult = await executeQuery(getQuestionQuery, questionParams);

    if (
      !questionResult.success ||
      !questionResult.data ||
      questionResult.data.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Question not found" },
        },
        { status: 404 }
      );
    }

    const correctAnswer = questionResult.data[0].correct_answer;
    const isCorrect = body.selected_option === correctAnswer;

    // Insert or update the answer
    const upsertQuery = `
      MERGE INTO QuizAnswers WITH (HOLDLOCK) AS target
      USING (SELECT @attemptId AS attempt_id, @questionId AS question_id) AS source
      ON target.attempt_id = source.attempt_id AND target.question_id = source.question_id
      WHEN MATCHED THEN
          UPDATE SET 
            selected_option = @selectedOption,
            is_correct = @isCorrect
      WHEN NOT MATCHED THEN
          INSERT (attempt_id, question_id, selected_option, is_correct)
          VALUES (@attemptId, @questionId, @selectedOption, @isCorrect)
      OUTPUT INSERTED.*;
    `;

    const params = {
      attemptId: body.attempt_id,
      questionId: body.question_id,
      selectedOption: body.selected_option,
      isCorrect: isCorrect ? 1 : 0,
    };

    const result = await executeQuery(upsertQuery, params);

    if (result.success && result.data && result.data.length > 0) {
      return NextResponse.json({
        success: true,
        data: result.data[0],
      });
    } else {
      const errorMessage = result.success
        ? "Answer submission succeeded but no data returned"
        : result.error?.message || "Unknown database error";

      return NextResponse.json(
        { success: false, error: { message: errorMessage } },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing POST /api/quizzes/attempts/answer:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}
