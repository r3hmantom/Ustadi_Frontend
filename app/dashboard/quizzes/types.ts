// Quiz interface from the API
export interface Quiz {
  quiz_id: number;
  student_id: number;
  title: string;
  description: string | null;
  created_at: string;
  is_public: boolean;
  questions_count: number;
}

// Question interface from the API
export interface Question {
  question_id: number;
  quiz_id: number;
  question_type: "MCQ" | "Short Answer" | "Long Answer";
  content: string;
  correct_answer: string;
  options?: string[];
}

// New quiz form state type
export interface NewQuizForm {
  title: string;
  description: string;
  is_public: boolean;
  student_id: number;
}