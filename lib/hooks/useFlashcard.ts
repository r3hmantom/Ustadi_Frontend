"use client";

import { useEffect } from "react";
import { useFlashcardStore } from "../stores/useFlashcardStore";
import { useUserStore } from "../stores/useUserStore";

export function useFlashcard() {
  const {
    flashcards,
    isLoading,
    error,
    currentFlashcard,
    fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    setCurrentFlashcard,
    clearError,
  } = useFlashcardStore();

  const { user } = useUserStore();
  const studentId = user?.studentId;

  useEffect(() => {
    if (studentId) {
      fetchFlashcards(studentId);
    }
  }, [studentId, fetchFlashcards]);

  // Compute derived data
  const categorizedFlashcards = flashcards.reduce(
    (acc, flashcard) => {
      const category = flashcard.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(flashcard);
      return acc;
    },
    {} as Record<string, typeof flashcards>
  );

  const categories = Object.keys(categorizedFlashcards);

  return {
    flashcards,
    categorizedFlashcards,
    categories,
    isLoading,
    error,
    currentFlashcard,
    fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    setCurrentFlashcard,
    clearError,
  };
}

export default useFlashcard;
