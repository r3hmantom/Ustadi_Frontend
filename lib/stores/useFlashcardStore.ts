"use client";

import { create } from "zustand";
import { fetchFlashcards as fetchFlashcardsApi } from "@/app/services/flashcardService";
import { useUserStore } from "./useUserStore";
import { api } from "@/lib/api";

interface Flashcard {
  id: number;
  student_id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at?: string;
  last_reviewed_at?: string;
  difficulty_level: number; // 1-5 scale
  category?: string;
  next_review_date?: string;
  interval_days?: number;
}

interface FlashcardState {
  flashcards: Flashcard[];
  isLoading: boolean;
  error: string | null;
  currentFlashcard: Flashcard | null;

  // Actions
  fetchFlashcards: (studentId?: number) => Promise<void>;
  createFlashcard: (
    data: Omit<Flashcard, "id" | "student_id" | "created_at">
  ) => Promise<void>;
  updateFlashcard: (id: number, data: Partial<Flashcard>) => Promise<void>;
  deleteFlashcard: (id: number) => Promise<void>;
  setCurrentFlashcard: (flashcard: Flashcard | null) => void;
  clearError: () => void;
}

export const useFlashcardStore = create<FlashcardState>()((set, get) => ({
  flashcards: [],
  isLoading: false,
  error: null,
  currentFlashcard: null,

  fetchFlashcards: async (studentId) => {
    try {
      set({ isLoading: true, error: null });

      if (!studentId) {
        const user = useUserStore.getState().user;
        if (!user) {
          throw new Error("User ID is required to fetch flashcards");
        }
        studentId = user.studentId;
      }

      const flashcards = await fetchFlashcardsApi(studentId);

      // Map from DB schema fields to interface fields
      const mappedFlashcards = flashcards.map(card => ({
        id: card.flashcard_id,
        student_id: card.student_id,
        question: card.front_content,
        answer: card.back_content,
        created_at: card.created_at?.toString() || new Date().toISOString(),
        difficulty_level: card.ease_factor ? Math.round(card.ease_factor) : 3,
        next_review_date: card.next_review_date?.toString(),
        interval_days: card.interval_days
      }));

      set({ flashcards: mappedFlashcards });
    } catch (err) {
      console.error("Error fetching flashcards:", err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createFlashcard: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const user = useUserStore.getState().user;
      if (!user) {
        throw new Error("You must be logged in to create flashcards");
      }

      const newFlashcard = await api.post<Flashcard>("/api/flashcards", {
        ...data,
        student_id: user.studentId,
      });

      set((state) => ({
        flashcards: [...state.flashcards, newFlashcard],
      }));
    } catch (err) {
      console.error("Error creating flashcard:", err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateFlashcard: async (id, data) => {
    try {
      set({ isLoading: true, error: null });

      const updatedFlashcard = await api.patch<Flashcard>(
        `/api/flashcards/${id}`,
        data
      );

      set((state) => ({
        flashcards: state.flashcards.map((flashcard) =>
          flashcard.id === id ? updatedFlashcard : flashcard
        ),
        currentFlashcard:
          state.currentFlashcard?.id === id
            ? updatedFlashcard
            : state.currentFlashcard,
      }));
    } catch (err) {
      console.error(`Error updating flashcard ${id}:`, err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFlashcard: async (id) => {
    try {
      set({ isLoading: true, error: null });

      await api.delete(`/api/flashcards/${id}`);

      set((state) => ({
        flashcards: state.flashcards.filter((flashcard) => flashcard.id !== id),
        currentFlashcard:
          state.currentFlashcard?.id === id ? null : state.currentFlashcard,
      }));
    } catch (err) {
      console.error(`Error deleting flashcard ${id}:`, err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentFlashcard: (flashcard) => set({ currentFlashcard: flashcard }),

  clearError: () => set({ error: null }),
}));
