import { StudySession } from "@/db/types";

/**
 * Interface for study session form data
 */
export interface StudySessionFormData {
  session_type: "Pomodoro" | "Revision" | "Group Study";
  start_time: string;
  end_time?: string | null;
  duration_minutes?: number | null;
  task_id?: number | null;
}

/**
 * Fetches study sessions for a specific student
 */
export const fetchStudySessions = async (
  studentId: number | undefined
): Promise<StudySession[]> => {
  if (!studentId) {
    return [];
  }

  const response = await fetch(`/api/study-sessions?student_id=${studentId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData?.error?.message ||
        `Failed to fetch study sessions: ${response.statusText}`
    );
  }

  const result = await response.json();

  if (result.success && result.data) {
    return result.data;
  } else {
    throw new Error(result.error?.message || "Failed to fetch study sessions");
  }
};

/**
 * Creates a new study session
 */
export const createStudySession = async (
  payload: StudySessionFormData & { student_id?: number }
): Promise<StudySession> => {
  const response = await fetch("/api/study-sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message ||
        `Failed to create study session: ${response.statusText}`
    );
  }

  return result.data!;
};

/**
 * Interface for study session update payload - can be partial fields of a session
 */
export type StudySessionUpdatePayload = Partial<StudySessionFormData>;

/**
 * Updates an existing study session
 */
export const updateStudySession = async (
  sessionId: number,
  payload: StudySessionUpdatePayload
): Promise<StudySession> => {
  const response = await fetch(`/api/study-sessions/${sessionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message ||
        `Failed to update study session: ${response.statusText}`
    );
  }

  return result.data!;
};

/**
 * Deletes a study session by ID
 */
export const deleteStudySession = async (
  sessionId: number
): Promise<StudySession> => {
  const response = await fetch(`/api/study-sessions/${sessionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message ||
        `Failed to delete study session: ${response.statusText}`
    );
  }

  return result.data!;
};
