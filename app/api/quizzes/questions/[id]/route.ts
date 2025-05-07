import { NextResponse, NextRequest } from "next/server";
import { executeQuery } from "@/db/utils";

/**
 * PATCH /api/quizzes/questions/{id}
 * Updates an existing question.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paramsAwaited = await params;
    const paramsId = await paramsAwaited.id;
    const questionId = parseInt(paramsId, 10);

    if (isNaN(questionId)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid question ID" } },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Build dynamic update query based on provided fields
    const updates: string[] = [];
    const queryParams: Record<string, unknown> = { questionId };

    // Only include fields that are provided in the update
    if (body.content !== undefined) {
      updates.push("content = @content");
      queryParams.content = body.content;
    }

    if (body.question_type !== undefined) {
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
      updates.push("question_type = @questionType");
      queryParams.questionType = body.question_type;
    }

    if (body.correct_answer !== undefined) {
      updates.push("correct_answer = @correctAnswer");
      queryParams.correctAnswer = body.correct_answer;
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
      UPDATE Questions
      SET ${updates.join(", ")}
      OUTPUT INSERTED.*
      WHERE question_id = @questionId;
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
          error: { message: "Question not found or not updated" },
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing PATCH /api/quizzes/questions/{id}:", error);

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
 * DELETE /api/quizzes/questions/{id}
 * Deletes a question by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paramsAwaited = await params;
    const paramsId = await paramsAwaited.id;
    const questionId = parseInt(paramsId, 10);

    if (isNaN(questionId)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid question ID" } },
        { status: 400 }
      );
    }

    const query = `
      DELETE FROM Questions
      OUTPUT DELETED.*
      WHERE question_id = @questionId;
    `;
    const queryParams = { questionId };

    const result = await executeQuery(query, queryParams);

    if (result.success && result.data && result.data.length > 0) {
      return NextResponse.json(
        { success: true, data: result.data[0] },
        { status: 200 }
      );
    } else if (result.success && (!result.data || result.data.length === 0)) {
      return NextResponse.json(
        { success: false, error: { message: "Question not found" } },
        { status: 404 }
      );
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error(
      "Error processing DELETE /api/quizzes/questions/{id}:",
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
