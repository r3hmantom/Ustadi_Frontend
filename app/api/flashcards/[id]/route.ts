import { NextRequest, NextResponse } from "next/server";
import {
  ApiResponse,
  ErrorResponse,
  SuccessResponse,
  Flashcard,
} from "@/db/types";
import { getSession } from "../../auth/utils";
import { executeQuery } from "@/db/utils";

// GET handler to fetch a specific flashcard
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<Flashcard>>> {
  try {
    // Check authentication
    const session = await getSession();

    if (!session) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Unauthorized" },
        },
        { status: 401 }
      );
    }

    const flashcardId = parseInt(params.id);

    if (isNaN(flashcardId)) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Invalid flashcard ID" },
        },
        { status: 400 }
      );
    }

    // Retrieve the flashcard, ensuring it belongs to the current user
    const query = `
      SELECT * FROM Flashcards 
      WHERE flashcard_id = @flashcardId 
      AND student_id = @studentId
    `;

    const queryParams = {
      flashcardId,
      studentId: session.user.studentId,
    };

    const result = await executeQuery<Flashcard>(query, queryParams);

    if (!result.success || result.data.length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Flashcard not found" },
        },
        { status: 404 }
      );
    }

    return NextResponse.json<SuccessResponse<Flashcard>>({
      success: true,
      data: result.data[0],
    });
  } catch (error) {
    console.error("Error fetching flashcard:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch flashcard";
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: { message },
      },
      { status: 500 }
    );
  }
}

// PATCH handler to update a flashcard
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<Flashcard>>> {
  try {
    // Check authentication
    const session = await getSession();

    if (!session) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Unauthorized" },
        },
        { status: 401 }
      );
    }

    const flashcardId = parseInt(params.id);

    if (isNaN(flashcardId)) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Invalid flashcard ID" },
        },
        { status: 400 }
      );
    }

    // Check if the flashcard exists and belongs to the user
    const checkQuery = `
      SELECT * FROM Flashcards 
      WHERE flashcard_id = @flashcardId 
      AND student_id = @studentId
    `;

    const checkParams = {
      flashcardId,
      studentId: session.user.studentId,
    };

    const checkResult = await executeQuery<Flashcard>(checkQuery, checkParams);

    if (!checkResult.success || checkResult.data.length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Flashcard not found" },
        },
        { status: 404 }
      );
    }

    const payload = await request.json();

    // Build the update SQL dynamically based on provided fields
    const updates: string[] = [];
    const updateParams: Record<string, any> = {
      flashcardId,
      studentId: session.user.studentId,
    };

    if (payload.front_content !== undefined) {
      updates.push("front_content = @frontContent");
      updateParams.frontContent = payload.front_content;
    }

    if (payload.back_content !== undefined) {
      updates.push("back_content = @backContent");
      updateParams.backContent = payload.back_content;
    }

    if (payload.next_review_date !== undefined) {
      updates.push("next_review_date = @nextReviewDate");
      updateParams.nextReviewDate = payload.next_review_date;
    }

    if (updates.length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "No fields to update" },
        },
        { status: 400 }
      );
    }

    // Update the flashcard
    const updateQuery = `
      UPDATE Flashcards 
      SET ${updates.join(", ")} 
      OUTPUT INSERTED.*
      WHERE flashcard_id = @flashcardId 
      AND student_id = @studentId
    `;

    const updateResult = await executeQuery<Flashcard>(
      updateQuery,
      updateParams
    );

    if (!updateResult.success || updateResult.data.length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Failed to update flashcard" },
        },
        { status: 500 }
      );
    }

    return NextResponse.json<SuccessResponse<Flashcard>>({
      success: true,
      data: updateResult.data[0],
    });
  } catch (error) {
    console.error("Error updating flashcard:", error);

    // Handle JSON parsing errors specially
    if (error instanceof SyntaxError) {
      return NextResponse.json<ErrorResponse>(
        { success: false, error: { message: "Invalid JSON payload" } },
        { status: 400 }
      );
    }

    // Handle all other errors
    const message =
      error instanceof Error ? error.message : "Failed to update flashcard";
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: { message },
      },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a flashcard
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<Flashcard>>> {
  try {
    // Check authentication
    const session = await getSession();

    if (!session) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Unauthorized" },
        },
        { status: 401 }
      );
    }

    const flashcardId = parseInt(params.id);

    if (isNaN(flashcardId)) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Invalid flashcard ID" },
        },
        { status: 400 }
      );
    }

    // Check if the flashcard exists and belongs to the user
    const checkQuery = `
      SELECT * FROM Flashcards 
      WHERE flashcard_id = @flashcardId 
      AND student_id = @studentId
    `;

    const checkParams = {
      flashcardId,
      studentId: session.user.studentId,
    };

    const checkResult = await executeQuery<Flashcard>(checkQuery, checkParams);

    if (!checkResult.success || checkResult.data.length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Flashcard not found" },
        },
        { status: 404 }
      );
    }

    // Store flashcard data to return it after deletion
    const flashcardToDelete = checkResult.data[0];

    // Delete the flashcard
    const deleteQuery = `
      DELETE FROM Flashcards 
      WHERE flashcard_id = @flashcardId 
      AND student_id = @studentId
    `;

    const deleteResult = await executeQuery(deleteQuery, checkParams);

    if (!deleteResult.success) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Failed to delete flashcard" },
        },
        { status: 500 }
      );
    }

    return NextResponse.json<SuccessResponse<Flashcard>>({
      success: true,
      data: flashcardToDelete,
    });
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete flashcard";
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: { message },
      },
      { status: 500 }
    );
  }
}
