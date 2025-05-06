import { NextRequest, NextResponse } from "next/server";
import {
  ApiResponse,
  ErrorResponse,
  SuccessResponse,
  Flashcard,
} from "@/db/types";
import { getSession } from "../../../auth/utils";
import { executeQuery } from "@/db/utils";

// POST handler for practicing flashcards
export async function POST(
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

    // Get the flashcard to practice
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

    const flashcard = result.data[0];

    const payload = await request.json();

    // Validate quality input (a measure of how easy it was to recall the answer)
    if (
      !payload.quality ||
      typeof payload.quality !== "number" ||
      payload.quality < 1 ||
      payload.quality > 5
    ) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Quality must be a number between 1 and 5" },
        },
        { status: 400 }
      );
    }

    // Implement the SuperMemo SM-2 algorithm for spaced repetition
    const { quality } = payload;
    const intervalDays = flashcard.interval_days;
    let { ease_factor: easeFactor } = flashcard;

    // Calculate new ease factor
    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    // Calculate new interval
    let nextIntervalDays;
    if (quality < 3) {
      // If recall was difficult, reset to beginning
      nextIntervalDays = 1;
    } else {
      // Otherwise, increase interval according to algorithm
      if (intervalDays === 1) {
        nextIntervalDays = 6;
      } else if (intervalDays === 6) {
        nextIntervalDays = Math.round(intervalDays * easeFactor);
      } else {
        nextIntervalDays = Math.round(intervalDays * easeFactor);
      }
    }

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextIntervalDays);
    const nextReviewDateStr = nextReviewDate.toISOString();

    // Update the flashcard with new spaced repetition values
    const updateQuery = `
      UPDATE Flashcards
      SET interval_days = @nextIntervalDays,
          ease_factor = @easeFactor,
          next_review_date = @nextReviewDate
      OUTPUT INSERTED.*
      WHERE flashcard_id = @flashcardId
    `;

    const updateParams = {
      nextIntervalDays,
      easeFactor,
      nextReviewDate: nextReviewDateStr,
      flashcardId,
    };

    const updateResult = await executeQuery<Flashcard>(
      updateQuery,
      updateParams
    );

    // Log the practice activity for leaderboard integration
    // Award points based on quality of recall
    const pointsEarned = quality >= 4 ? 10 : quality >= 3 ? 5 : 2;
    const currentDate = new Date().toISOString();

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
      )
    `;

    const activityParams = {
      studentId: session.user.studentId,
      activityType: "FLASHCARD_PRACTICE",
      activityDate: currentDate,
      pointsEarned,
    };

    await executeQuery(activityQuery, activityParams);

    if (
      updateResult.success &&
      updateResult.data &&
      updateResult.data.length > 0
    ) {
      return NextResponse.json<SuccessResponse<Flashcard>>({
        success: true,
        data: updateResult.data[0],
      });
    } else {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: "Failed to update flashcard after practice" },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error practicing flashcard:", error);

    // Handle JSON parsing errors specially
    if (error instanceof SyntaxError) {
      return NextResponse.json<ErrorResponse>(
        { success: false, error: { message: "Invalid JSON payload" } },
        { status: 400 }
      );
    }

    // Handle all other errors
    const message =
      error instanceof Error
        ? error.message
        : "Failed to record flashcard practice";
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: { message },
      },
      { status: 500 }
    );
  }
}
