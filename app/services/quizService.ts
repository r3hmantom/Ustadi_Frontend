import { toast } from "sonner";
import { Quiz, Question } from "@/db/types";

// Types for the quiz service
export interface QuizFormData {
  title: string;
  description?: string;
  is_public?: boolean;
}

export interface QuestionFormData {
  content: string;
  question_type: "MCQ" | "Short Answer" | "Long Answer";
  correct_answer: string;
}

export interface QuizWithQuestions extends Quiz {
  questions: Question[];
}

// Helper for API requests
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.error?.message || "An unknown error occurred";
    throw new Error(errorMessage);
  }

  if (!data.success) {
    throw new Error(data.error?.message || "Operation failed");
  }

  return data.data;
};

// Quiz CRUD operations
export const fetchQuizzes = async (studentId?: number): Promise<Quiz[]> => {
  try {
    const url = studentId
      ? `/api/quizzes?student_id=${studentId}`
      : "/api/quizzes";

    const response = await fetch(url);
    return handleResponse<Quiz[]>(response);
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
    toast.error("Failed to load quizzes");
    throw error;
  }
};

export const fetchQuiz = async (quizId: number): Promise<QuizWithQuestions> => {
  try {
    const response = await fetch(`/api/quizzes/${quizId}`);
    return handleResponse<QuizWithQuestions>(response);
  } catch (error) {
    console.error(`Failed to fetch quiz ${quizId}:`, error);
    toast.error("Failed to load quiz details");
    throw error;
  }
};

export const createQuiz = async (
  studentId: number,
  formData: QuizFormData
): Promise<Quiz> => {
  try {
    const response = await fetch("/api/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: studentId,
        title: formData.title,
        description: formData.description,
        is_public: formData.is_public,
      }),
    });

    return handleResponse<Quiz>(response);
  } catch (error) {
    console.error("Failed to create quiz:", error);
    toast.error("Failed to create quiz");
    throw error;
  }
};

export const updateQuiz = async (
  quizId: number,
  formData: Partial<QuizFormData>
): Promise<Quiz> => {
  try {
    const response = await fetch(`/api/quizzes/${quizId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    return handleResponse<Quiz>(response);
  } catch (error) {
    console.error(`Failed to update quiz ${quizId}:`, error);
    toast.error("Failed to update quiz");
    throw error;
  }
};

export const deleteQuiz = async (quizId: number): Promise<Quiz> => {
  try {
    const response = await fetch(`/api/quizzes/${quizId}`, {
      method: "DELETE",
    });

    return handleResponse<Quiz>(response);
  } catch (error) {
    console.error(`Failed to delete quiz ${quizId}:`, error);
    toast.error("Failed to delete quiz");
    throw error;
  }
};

// Question CRUD operations
export const addQuestion = async (
  quizId: number,
  questionData: QuestionFormData
): Promise<Question> => {
  try {
    const response = await fetch("/api/quizzes/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quiz_id: quizId,
        ...questionData,
      }),
    });

    return handleResponse<Question>(response);
  } catch (error) {
    console.error("Failed to add question:", error);
    toast.error("Failed to add question");
    throw error;
  }
};

export const updateQuestion = async (
  questionId: number,
  questionData: Partial<QuestionFormData>
): Promise<Question> => {
  try {
    const response = await fetch(`/api/quizzes/questions/${questionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionData),
    });

    return handleResponse<Question>(response);
  } catch (error) {
    console.error(`Failed to update question ${questionId}:`, error);
    toast.error("Failed to update question");
    throw error;
  }
};

export const deleteQuestion = async (questionId: number): Promise<Question> => {
  try {
    const response = await fetch(`/api/quizzes/questions/${questionId}`, {
      method: "DELETE",
    });

    return handleResponse<Question>(response);
  } catch (error) {
    console.error(`Failed to delete question ${questionId}:`, error);
    toast.error("Failed to delete question");
    throw error;
  }
};
