"use client";

import {
  createFlashcard as createFlashcardApi,
  deleteFlashcard as deleteFlashcardApi,
  fetchFlashcards as fetchFlashcardsApi,
  updateFlashcard as updateFlashcardApi,
} from "@/app/services/flashcardService";
import { api } from "@/lib/api";
import { create } from "zustand";
import { useUserStore } from "./useUserStore";

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
  createFlashcard: (data: { front_content: string; back_content: string }) => Promise<void>;
  updateFlashcard: (id: number, data: { front_content?: string; back_content?: string }) => Promise<void>;
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

      // Call the API to create the flashcard
      const flashcardData = {
        ...data,
        student_id: user.studentId,
      };
      
      const newFlashcard = await createFlashcardApi(flashcardData);

      // Map to our store format
      const mappedFlashcard = {
        id: newFlashcard.flashcard_id,
        student_id: newFlashcard.student_id,
        question: newFlashcard.front_content,
        answer: newFlashcard.back_content,
        created_at: newFlashcard.created_at?.toString() || new Date().toISOString(),
        difficulty_level: newFlashcard.ease_factor ? Math.round(newFlashcard.ease_factor) : 3,
        next_review_date: newFlashcard.next_review_date?.toString(),
        interval_days: newFlashcard.interval_days
      };

      set((state) => ({
        flashcards: [...state.flashcards, mappedFlashcard],
      }));
      
      return mappedFlashcard;
    } catch (err) {
      console.error("Error creating flashcard:", err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateFlashcard: async (id, data) => {
    try {
      set({ isLoading: true, error: null });

      // Map data fields to match API expectations
      const apiData = {
        front_content: data.front_content,
        back_content: data.back_content,
      };

      // Call the API to update the flashcard
      const updatedFlashcard = await updateFlashcardApi(id, apiData);
      
      // Map to our store format
      const mappedFlashcard = {
        id: updatedFlashcard.flashcard_id,
        student_id: updatedFlashcard.student_id,
        question: updatedFlashcard.front_content,
        answer: updatedFlashcard.back_content,
        created_at: updatedFlashcard.created_at?.toString() || new Date().toISOString(),
        difficulty_level: updatedFlashcard.ease_factor ? Math.round(updatedFlashcard.ease_factor) : 3,
        next_review_date: updatedFlashcard.next_review_date?.toString(),
        interval_days: updatedFlashcard.interval_days
      };

      set((state) => ({
        flashcards: state.flashcards.map((flashcard) =>
          flashcard.id === id ? mappedFlashcard : flashcard
        ),
        currentFlashcard:
          state.currentFlashcard?.id === id
            ? mappedFlashcard
            : state.currentFlashcard,
      }));
      
      return mappedFlashcard;
    } catch (err) {
      console.error(`Error updating flashcard ${id}:`, err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFlashcard: async (id) => {
    try {
      set({ isLoading: true, error: null });

      // Call the API to delete the flashcard
      await deleteFlashcardApi(id);

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
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentFlashcard: (flashcard) => set({ currentFlashcard: flashcard }),

  clearError: () => set({ error: null }),
}));
