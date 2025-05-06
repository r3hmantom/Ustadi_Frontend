import { Flashcard } from "@/db/types";

// Type for creating/updating flashcards
export interface FlashcardFormData {
  front_content: string;
  back_content: string;
  next_review_date?: string;
}

/**
 * Fetches flashcards for a specific student
 */
export const fetchFlashcards = async (
  studentId: number | undefined
): Promise<Flashcard[]> => {
  if (!studentId) {
    return [];
  }

  const response = await fetch(`/api/flashcards?student_id=${studentId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData?.error?.message ||
        `Failed to fetch flashcards: ${response.statusText}`
    );
  }

  const result = await response.json();

  if (result.success && result.data) {
    return result.data;
  } else {
    throw new Error(result.error?.message || "Failed to fetch flashcards");
  }
};

/**
 * Creates a new flashcard
 */
export const createFlashcard = async (
  payload: FlashcardFormData & { student_id?: number }
): Promise<Flashcard> => {
  const response = await fetch("/api/flashcards", {
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
        `Failed to create flashcard: ${response.statusText}`
    );
  }

  return result.data!;
};

/**
 * Updates an existing flashcard
 */
export const updateFlashcard = async (
  flashcardId: number,
  payload: Partial<FlashcardFormData>
): Promise<Flashcard> => {
  const response = await fetch(`/api/flashcards/${flashcardId}`, {
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
        `Failed to update flashcard: ${response.statusText}`
    );
  }

  return result.data!;
};

/**
 * Deletes a flashcard by ID
 */
export const deleteFlashcard = async (
  flashcardId: number
): Promise<Flashcard> => {
  const response = await fetch(`/api/flashcards/${flashcardId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message ||
        `Failed to delete flashcard: ${response.statusText}`
    );
  }

  return result.data!;
};

/**
 * Records a practice attempt for a flashcard and updates its spaced repetition parameters
 * @param flashcardId The flashcard ID
 * @param quality The quality of recall (1-5, where 1 is hardest and 5 is easiest)
 */
export const practiceFlashcard = async (
  flashcardId: number,
  quality: number
): Promise<Flashcard> => {
  const response = await fetch(`/api/flashcards/${flashcardId}/practice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quality }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message ||
        `Failed to record practice: ${response.statusText}`
    );
  }

  return result.data!;
};
