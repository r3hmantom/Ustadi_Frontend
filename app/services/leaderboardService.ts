import { LeaderboardEntry } from "@/db/types";

interface LeaderboardResponse {
  success: boolean;
  data: (LeaderboardEntry & { student_name: string })[];
}

export type PeriodType = "Weekly" | "Monthly";

/**
 * Fetches leaderboard data based on period type
 */
export async function fetchLeaderboard(
  periodType: PeriodType = "Weekly"
): Promise<LeaderboardResponse> {
  try {
    // Use absolute URL for proper handling in both client and server contexts
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000");

    const response = await fetch(
      `${baseUrl}/api/leaderboard?period_type=${periodType}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return {
      success: false,
      data: [],
    };
  }
}

/**
 * Updates points for a student based on activity
 */
export async function updateLeaderboardPoints(
  studentId: number,
  points: number,
  activityType: string,
  relatedTaskId?: number,
  relatedQuizId?: number
): Promise<{ success: boolean; message: string }> {
  try {
    // Use absolute URL for proper handling in both client and server contexts
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000");

    const response = await fetch(`${baseUrl}/api/leaderboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: studentId,
        points,
        activity_type: activityType,
        related_task_id: relatedTaskId,
        related_quiz_id: relatedQuizId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message ||
          `Error ${response.status}: ${response.statusText}`
      );
    }

    const result = await response.json();
    return {
      success: true,
      message: result.data?.message || "Points updated successfully",
    };
  } catch (error) {
    console.error("Error updating leaderboard points:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update points",
    };
  }
}

/**
 * Points calculation for different activities
 */
export const POINTS = {
  TASK_COMPLETION: 10,
  QUIZ_COMPLETION: 15,
  QUIZ_PERFECT_SCORE: 10, // Additional points for perfect score
  STUDY_SESSION_COMPLETED: 5,
  REVISION_COMPLETED: 8,
};

/**
 * Updates leaderboard points when a task is completed
 */
export async function awardTaskCompletionPoints(
  studentId: number,
  taskId: number
): Promise<void> {
  await updateLeaderboardPoints(
    studentId,
    POINTS.TASK_COMPLETION,
    "Task Completion",
    taskId
  );
}

/**
 * Updates leaderboard points when a quiz is completed
 */
export async function awardQuizCompletionPoints(
  studentId: number,
  quizId: number,
  score: number,
  totalQuestions: number
): Promise<void> {
  // Award base points for completing the quiz
  await updateLeaderboardPoints(
    studentId,
    POINTS.QUIZ_COMPLETION,
    "Quiz Completion",
    undefined,
    quizId
  );

  // Award bonus points for perfect score
  if (score === totalQuestions) {
    await updateLeaderboardPoints(
      studentId,
      POINTS.QUIZ_PERFECT_SCORE,
      "Quiz Perfect Score",
      undefined,
      quizId
    );
  }
}

/**
 * Updates leaderboard points when a study session is completed
 */
export async function awardStudySessionPoints(
  studentId: number,
  sessionId: number,
  sessionType: string
): Promise<void> {
  const points =
    sessionType === "Revision"
      ? POINTS.REVISION_COMPLETED
      : POINTS.STUDY_SESSION_COMPLETED;

  await updateLeaderboardPoints(
    studentId,
    points,
    `${sessionType} Session Completed`,
    undefined,
    undefined
  );
}
