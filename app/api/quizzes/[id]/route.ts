import { NextResponse, NextRequest } from "next/server";
import { executeQuery } from "@/db/utils";

/**
 * GET /api/quizzes/{id}
 * Fetches a specific quiz by ID with its questions
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paramsAwaited = await params;
    const paramsId = await paramsAwaited.id;
    const quizId = parseInt(paramsId, 10);

    if (isNaN(quizId)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid quiz ID" } },
        { status: 400 }
      );
    }

    // Get the quiz details
    const quizQuery = "SELECT * FROM Quizzes WHERE quiz_id = @quizId";
    const quizParams = { quizId };

    const quizResult = await executeQuery(quizQuery, quizParams);

    if (!quizResult.success || quizResult.data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: quizResult.success
              ? "Quiz not found"
              : quizResult.error?.message,
          },
        },
        { status: quizResult.success ? 404 : 500 }
      );
    }

    // Get the quiz questions
    const questionsQuery =
      "SELECT * FROM Questions WHERE quiz_id = @quizId ORDER BY question_id";
    const questionsResult = await executeQuery(questionsQuery, quizParams);

    if (!questionsResult.success) {
      return NextResponse.json(questionsResult, { status: 500 });
    }

    // Combine quiz and questions in response
    return NextResponse.json({
      success: true,
      data: {
        ...(typeof quizResult.data[0] === "object" &&
        quizResult.data[0] !== null
          ? quizResult.data[0]
          : {}),
        questions: questionsResult.data || [],
      },
    });
  } catch (error) {
    console.error("Error processing GET /api/quizzes/{id}:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/quizzes/{id}
 * Updates an existing quiz.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paramsAwaited = await params;
    const paramsId = await paramsAwaited.id;
    const quizId = parseInt(paramsId, 10);

    if (isNaN(quizId)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid quiz ID" } },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Build dynamic update query based on provided fields
    const updates: string[] = [];
    const queryParams: Record<string, unknown> = { quizId };

    // Only include fields that are provided in the update
    if (body.title !== undefined) {
      updates.push("title = @title");
      queryParams.title = body.title;
    }

    if (body.description !== undefined) {
      updates.push("description = @description");
      queryParams.description = body.description;
    }

    if (body.is_public !== undefined) {
      updates.push("is_public = @isPublic");
      queryParams.isPublic = body.is_public;
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
      UPDATE Quizzes
      SET ${updates.join(", ")}
      OUTPUT INSERTED.*
      WHERE quiz_id = @quizId;
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
          error: { message: "Quiz not found or not updated" },
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing PATCH /api/quizzes/{id}:", error);

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
 * DELETE /api/quizzes/{id}
 * Deletes a quiz by ID (will cascade delete questions)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paramsAwaited = await params;
    const paramsId = await paramsAwaited.id;
    const quizId = parseInt(paramsId, 10);

    if (isNaN(quizId)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid quiz ID" } },
        { status: 400 }
      );
    }

    const query = `
      DELETE FROM Quizzes
      OUTPUT DELETED.*
      WHERE quiz_id = @quizId;
    `;
    const queryParams = { quizId };

    const result = await executeQuery(query, queryParams);

    if (result.success && result.data && result.data.length > 0) {
      return NextResponse.json(
        { success: true, data: result.data[0] },
        { status: 200 }
      );
    } else if (result.success && (!result.data || result.data.length === 0)) {
      return NextResponse.json(
        { success: false, error: { message: "Quiz not found" } },
        { status: 404 }
      );
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing DELETE /api/quizzes/{id}:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}
