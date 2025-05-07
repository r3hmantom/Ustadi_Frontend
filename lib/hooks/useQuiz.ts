"use client";

import { useEffect } from "react";
import { useQuizStore } from "../stores/useQuizStore";
import { useUserStore } from "../stores/useUserStore";

export function useQuiz(quizId?: number) {
  const {
    quizzes,
    currentQuiz,
    isLoading,
    isLoadingQuiz,
    error,
    fetchQuizzes,
    fetchQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    clearError,
    clearCurrentQuiz,
  } = useQuizStore();

  const { user } = useUserStore();
  const studentId = user?.studentId;

  // Fetch all quizzes for the student by default
  useEffect(() => {
    fetchQuizzes(studentId);
  }, [studentId, fetchQuizzes]);

  // If a quizId is provided, fetch that specific quiz
  useEffect(() => {
    if (quizId) {
      fetchQuizById(quizId);
    }
  }, [quizId, fetchQuizById]);

  // Compute derived data
  const categorizedQuizzes = quizzes.reduce(
    (acc, quiz) => {
      const category = quiz.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(quiz);
      return acc;
    },
    {} as Record<string, typeof quizzes>
  );

  const quizCategories = Object.keys(categorizedQuizzes);

  return {
    quizzes,
    currentQuiz,
    categorizedQuizzes,
    quizCategories,
    isLoading,
    isLoadingQuiz,
    error,
    fetchQuizzes,
    fetchQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    clearError,
    clearCurrentQuiz,
  };
}

export default useQuiz;
