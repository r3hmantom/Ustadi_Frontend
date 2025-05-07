"use client";

import { create } from "zustand";
import { fetchQuizzes, fetchQuiz } from "@/app/services/quizService";
import { useUserStore } from "./useUserStore";
import { api } from "@/lib/api";

interface QuizQuestion {
  id: number;
  quiz_id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  student_id?: number;
  category?: string;
  created_at: string;
  updated_at?: string;
  difficulty?: "easy" | "medium" | "hard";
  time_limit_minutes?: number;
}

interface QuizWithQuestions extends Quiz {
  questions: QuizQuestion[];
}

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: QuizWithQuestions | null;
  isLoading: boolean;
  isLoadingQuiz: boolean;
  error: string | null;

  // Actions
  fetchQuizzes: (studentId?: number) => Promise<void>;
  fetchQuizById: (quizId: number) => Promise<void>;
  createQuiz: (
    quiz: Omit<Quiz, "id" | "created_at">,
    questions: Omit<QuizQuestion, "id" | "quiz_id">[]
  ) => Promise<void>;
  updateQuiz: (
    quizId: number,
    quiz: Partial<Quiz>,
    questions?: Partial<QuizQuestion>[]
  ) => Promise<void>;
  deleteQuiz: (quizId: number) => Promise<void>;
  clearError: () => void;
  clearCurrentQuiz: () => void;
}

export const useQuizStore = create<QuizState>()((set, get) => ({
  quizzes: [],
  currentQuiz: null,
  isLoading: false,
  isLoadingQuiz: false,
  error: null,

  fetchQuizzes: async (studentId) => {
    try {
      set({ isLoading: true, error: null });

      if (!studentId) {
        const user = useUserStore.getState().user;
        if (user) {
          studentId = user.studentId;
        }
        // If studentId is still undefined, fetchQuizzes will just get all quizzes
      }

      const quizzes = await fetchQuizzes(studentId);

      set({ quizzes });
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchQuizById: async (quizId) => {
    try {
      set({ isLoadingQuiz: true, error: null });

      const quiz = await fetchQuiz(quizId);

      set({ currentQuiz: quiz });
    } catch (err) {
      console.error(`Error fetching quiz ${quizId}:`, err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoadingQuiz: false });
    }
  },

  createQuiz: async (quiz, questions) => {
    try {
      set({ isLoading: true, error: null });

      const user = useUserStore.getState().user;
      if (!user && !quiz.student_id) {
        throw new Error("Student ID is required to create a quiz");
      }

      const quizData = {
        ...quiz,
        student_id: quiz.student_id || user?.studentId,
      };

      const newQuiz = await api.post<QuizWithQuestions>("/api/quizzes", {
        quiz: quizData,
        questions,
      });

      set((state) => ({
        quizzes: [...state.quizzes, newQuiz],
        currentQuiz: newQuiz,
      }));
    } catch (err) {
      console.error("Error creating quiz:", err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuiz: async (quizId, quiz, questions) => {
    try {
      set({ isLoading: true, error: null });

      const updateData: {
        quiz: Partial<Quiz>;
        questions?: Partial<QuizQuestion>[];
      } = {
        quiz,
      };

      if (questions) {
        updateData.questions = questions;
      }

      const updatedQuiz = await api.patch<QuizWithQuestions>(
        `/api/quizzes/${quizId}`,
        updateData
      );

      set((state) => {
        // Update quiz in list if it exists
        const updatedQuizzes = state.quizzes.map((q) =>
          q.id === quizId ? updatedQuiz : q
        );

        return {
          quizzes: updatedQuizzes,
          currentQuiz:
            state.currentQuiz?.id === quizId ? updatedQuiz : state.currentQuiz,
        };
      });
    } catch (err) {
      console.error(`Error updating quiz ${quizId}:`, err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteQuiz: async (quizId) => {
    try {
      set({ isLoading: true, error: null });

      await api.delete(`/api/quizzes/${quizId}`);

      set((state) => ({
        quizzes: state.quizzes.filter((quiz) => quiz.id !== quizId),
        currentQuiz:
          state.currentQuiz?.id === quizId ? null : state.currentQuiz,
      }));
    } catch (err) {
      console.error(`Error deleting quiz ${quizId}:`, err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentQuiz: () => set({ currentQuiz: null }),
}));
