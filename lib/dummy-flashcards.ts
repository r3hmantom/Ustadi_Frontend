// Dummy flashcard data for testing
export const dummyFlashcards = [
  {
    flashcard_id: 1,
    student_id: 1,
    front_content: "What is photosynthesis?",
    back_content: "The process by which green plants use sunlight to synthesize foods from carbon dioxide and water",
    next_review_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    interval_days: 1,
    ease_factor: 2.5,
    created_at: "2025-04-14T10:30:00Z",
    tags: ["Biology", "Science"]
  },
  {
    flashcard_id: 2,
    student_id: 1,
    front_content: "When did World War II end?",
    back_content: "1945",
    next_review_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // day after tomorrow
    interval_days: 2,
    ease_factor: 2.3,
    created_at: "2025-04-13T14:20:00Z",
    tags: ["History"]
  },
  {
    flashcard_id: 3,
    student_id: 1,
    front_content: "What is the chemical formula for water?",
    back_content: "H₂O",
    next_review_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    interval_days: 3,
    ease_factor: 2.7,
    created_at: "2025-04-12T09:45:00Z",
    tags: ["Chemistry", "Science"]
  },
  {
    flashcard_id: 4,
    student_id: 1,
    front_content: "Who wrote 'Romeo and Juliet'?",
    back_content: "William Shakespeare",
    next_review_date: new Date(Date.now()).toISOString(), // today
    interval_days: 1,
    ease_factor: 2.5,
    created_at: "2025-04-15T16:10:00Z",
    tags: ["Literature"]
  },
  {
    flashcard_id: 5,
    student_id: 1,
    front_content: "What is the Pythagorean theorem?",
    back_content: "In a right triangle, the square of the length of the hypotenuse equals the sum of the squares of the other two sides (a² + b² = c²)",
    next_review_date: new Date(Date.now()).toISOString(), // today
    interval_days: 1,
    ease_factor: 2.2,
    created_at: "2025-04-15T11:25:00Z",
    tags: ["Mathematics"]
  },
  {
    flashcard_id: 6,
    student_id: 2, // Different student
    front_content: "What is the capital of France?",
    back_content: "Paris",
    next_review_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    interval_days: 1,
    ease_factor: 2.5,
    created_at: "2025-04-14T13:40:00Z",
    tags: ["Geography"]
  }
];

// Function to calculate the next interval using the SuperMemo SM-2 algorithm
export function calculateNextInterval(
  intervalDays: number,
  easeFactor: number,
  quality: number // 0-5 where 0 is complete blackout, 5 is perfect recall
): { newIntervalDays: number; newEaseFactor: number } {
  // Constrain quality between 0 and 5
  const q = Math.max(0, Math.min(5, quality));
  
  // Calculate new ease factor
  // EF := EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  let newEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  
  // Ensure ease factor doesn't go below 1.3
  newEaseFactor = Math.max(1.3, newEaseFactor);
  
  // Calculate new interval
  let newIntervalDays;
  
  if (q < 3) {
    // If recall was difficult, reset interval to 1
    newIntervalDays = 1;
  } else {
    // Calculate next interval based on current interval and ease factor
    if (intervalDays === 1) {
      newIntervalDays = 6;
    } else if (intervalDays === 6) {
      newIntervalDays = Math.round(intervalDays * newEaseFactor);
    } else {
      newIntervalDays = Math.round(intervalDays * newEaseFactor);
    }
  }
  
  return { newIntervalDays, newEaseFactor };
}