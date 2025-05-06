import { NextRequest, NextResponse } from "next/server";
import {
  ApiResponse,
  ErrorResponse,
  SuccessResponse,
  Flashcard,
} from "@/db/types";
import { getSession } from "../auth/utils";
import { executeQuery } from "@/db/utils";

// GET handler to fetch flashcards
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Flashcard[]>>> {
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

    // Query flashcards for the current user, ordered by next_review_date
    const query =
      "SELECT * FROM Flashcards WHERE student_id = @studentId ORDER BY next_review_date ASC";
    const params = { studentId: session.user.studentId };

    const result = await executeQuery<Flashcard[]>(query, params);

    if (result.success) {
      return NextResponse.json<SuccessResponse<Flashcard[]>>({
        success: true,
        data: result.data,
      });
    } else {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: {
            message: result.error?.message || "Failed to fetch flashcards",
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: { message },
      },
      { status: 500 }
    );
  }
}

// POST handler to create a new flashcard
export async function POST(
  request: NextRequest
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

    const payload = await request.json();

    // Validate required fields
    if (!payload.front_content || !payload.back_content) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Front and back content are required" },
        },
        { status: 400 }
      );
    }

    // Set default values if not provided
    const currentDate = new Date().toISOString();

    // Build query with consistent parameter naming
    const query = `
      INSERT INTO Flashcards (
        student_id, 
        front_content, 
        back_content, 
        next_review_date, 
        interval_days, 
        ease_factor, 
        created_at
      ) 
      OUTPUT INSERTED.*
      VALUES (
        @studentId,
        @frontContent,
        @backContent,
        @nextReviewDate,
        @intervalDays,
        @easeFactor,
        @createdAt
      );
    `;

    // Map request body to params with consistent camelCase naming
    const params = {
      studentId: session.user.studentId,
      frontContent: payload.front_content,
      backContent: payload.back_content,
      nextReviewDate: payload.next_review_date || currentDate,
      intervalDays: payload.interval_days || 1,
      easeFactor: payload.ease_factor || 2.5,
      createdAt: currentDate,
    };

    const result = await executeQuery<Flashcard[]>(query, params);

    if (result.success && result.data && result.data.length > 0) {
      // Log activity for leaderboard integration
      const activityQuery = `
        INSERT INTO ActivityLog (
          student_id, 
          activity_type, 
          activity_date, 
          points_earned
        ) 
        VALUES (
          @studentId,
          @activityType,
          @activityDate,
          @pointsEarned
        );
      `;

      const activityParams = {
        studentId: session.user.studentId,
        activityType: "FLASHCARD_CREATED",
        activityDate: currentDate,
        pointsEarned: 5,
      };

      await executeQuery(activityQuery, activityParams);

      return NextResponse.json<SuccessResponse<Flashcard>>(
        {
          success: true,
          data: result.data[0],
        },
        { status: 201 }
      );
    } else {
      // Handle both no data case and execution error case
      const errorMessage = result.success
        ? "Flashcard creation succeeded but no data returned"
        : result.error?.message || "Unknown database error";

      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: errorMessage },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating flashcard:", error);

    // Handle JSON parsing errors specially
    if (error instanceof SyntaxError) {
      return NextResponse.json<ErrorResponse>(
        { success: false, error: { message: "Invalid JSON payload" } },
        { status: 400 }
      );
    }

    // Handle all other errors
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: { message },
      },
      { status: 500 }
    );
  }
}
