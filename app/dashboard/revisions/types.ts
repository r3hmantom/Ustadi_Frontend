// Types for the revisions feature
export interface Flashcard {
  flashcard_id: number;
  student_id: number;
  front_content: string;
  back_content: string;
  next_review_date: string;
  interval_days: number;
  ease_factor: number;
  created_at: string;
  tags?: string[];
}

// Type for creating a new flashcard
export interface NewFlashcard {
  student_id: number;
  front_content: string;
  back_content: string;
  tags?: string[];
}

// Type for review quality rating
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

// Type for filters
export interface FlashcardFilters {
  searchQuery: string;
  selectedTags: string[];
  dueSoon: boolean;
}