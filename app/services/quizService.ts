import { toast } from "sonner";
import { Quiz, Question, QuizAttempt, QuizAnswer } from "@/db/types";

// Types for the quiz service
export interface QuizFormData {
  title: string;
  description?: string;
  is_public?: boolean;
}

export interface McqQuestionFormData {
  content: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "a" | "b" | "c" | "d";
}

export interface QuizWithQuestions extends Quiz {
  questions: Question[];
}

export interface QuizAttemptData {
  quiz_id: number;
  student_id: number;
  total_questions: number;
}

export interface QuizAnswerData {
  question_id: number;
  selected_option: "a" | "b" | "c" | "d";
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

// Question operations
export const addQuestion = async (
  quizId: number,
  questionData: McqQuestionFormData
): Promise<Question> => {
  try {
    const response = await fetch("/api/quizzes/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quiz_id: quizId,
        question_type: "MCQ",
        content: questionData.content,
        option_a: questionData.option_a,
        option_b: questionData.option_b,
        option_c: questionData.option_c,
        option_d: questionData.option_d,
        correct_answer: questionData.correct_answer,
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
  questionData: Partial<McqQuestionFormData>
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

// Quiz Attempt operations
export const startQuizAttempt = async (
  quizId: number,
  studentId: number,
  totalQuestions: number
): Promise<QuizAttempt> => {
  try {
    const response = await fetch("/api/quizzes/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quiz_id: quizId,
        student_id: studentId,
        total_questions: totalQuestions,
      }),
    });

    return handleResponse<QuizAttempt>(response);
  } catch (error) {
    console.error("Failed to start quiz attempt:", error);
    toast.error("Failed to start quiz");
    throw error;
  }
};

export const submitAnswer = async (
  attemptId: number,
  questionId: number,
  selectedOption: "a" | "b" | "c" | "d"
): Promise<QuizAnswer> => {
  try {
    const response = await fetch("/api/quizzes/attempts/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attempt_id: attemptId,
        question_id: questionId,
        selected_option: selectedOption,
      }),
    });

    return handleResponse<QuizAnswer>(response);
  } catch (error) {
    console.error("Failed to submit answer:", error);
    toast.error("Failed to submit answer");
    throw error;
  }
};

export const completeQuizAttempt = async (
  attemptId: number
): Promise<QuizAttempt> => {
  try {
    const response = await fetch(
      `/api/quizzes/attempts/${attemptId}/complete`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      }
    );

    return handleResponse<QuizAttempt>(response);
  } catch (error) {
    console.error(`Failed to complete quiz attempt ${attemptId}:`, error);
    toast.error("Failed to complete quiz");
    throw error;
  }
};

export const fetchQuizAttempts = async (
  studentId: number,
  quizId?: number
): Promise<QuizAttempt[]> => {
  try {
    let url = `/api/quizzes/attempts?student_id=${studentId}`;
    if (quizId) {
      url += `&quiz_id=${quizId}`;
    }

    const response = await fetch(url);
    return handleResponse<QuizAttempt[]>(response);
  } catch (error) {
    console.error("Failed to fetch quiz attempts:", error);
    toast.error("Failed to load quiz attempts");
    throw error;
  }
};

export const fetchQuizAttemptDetails = async (
  attemptId: number
): Promise<{
  attempt: QuizAttempt;
  answers: QuizAnswer[];
  questions: Question[];
}> => {
  try {
    const response = await fetch(`/api/quizzes/attempts/${attemptId}`);
    return handleResponse<{
      attempt: QuizAttempt;
      answers: QuizAnswer[];
      questions: Question[];
    }>(response);
  } catch (error) {
    console.error(`Failed to fetch quiz attempt ${attemptId}:`, error);
    toast.error("Failed to load quiz attempt details");
    throw error;
  }
};
