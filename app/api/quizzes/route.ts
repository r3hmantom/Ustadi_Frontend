import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { dummyQuizzes } from "@/lib/dummy-quizzes";

// Define types based on the SQL schema
export interface Quiz {
  quiz_id: number;
  student_id: number;
  title: string;
  description: string | null;
  created_at: string;
  is_public: boolean;
  questions_count?: number;
}

export interface Question {
  question_id: number;
  quiz_id: number;
  question_type: "MCQ" | "Short Answer" | "Long Answer";
  content: string;
  correct_answer: string;
  options?: string[]; // For MCQ questions
}

// GET handler to retrieve quizzes with optional filters
export async function GET(req: NextRequest) {
  try {
    // In a real app, this would query the database
    // For now, use dummy data
    
    const searchParams = req.nextUrl.searchParams;
    const student_id = parseInt(searchParams.get("student_id") || "1");
    const isPublic = searchParams.get("is_public") === "true";
    const search = searchParams.get("search");
    
    let filteredQuizzes = [...dummyQuizzes].map(quiz => {
      const { questions, ...quizData } = quiz;
      return quizData;
    });
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredQuizzes = filteredQuizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchLower) || 
        (quiz.description?.toLowerCase().includes(searchLower) || false)
      );
    }
    
    // We'll always include the student's own quizzes
    // If is_public is true, we'll also include public quizzes from others
    filteredQuizzes = filteredQuizzes.filter(quiz => 
      quiz.student_id === student_id || (isPublic && quiz.is_public)
    );
    
    return NextResponse.json(filteredQuizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

// POST handler to create a new quiz
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      student_id,
      title,
      description,
      is_public,
      questions = []
    } = body;
    
    // Validate required fields
    if (!student_id || !title) {
      return NextResponse.json(
        { error: "Student ID and title are required" },
        { status: 400 }
      );
    }
    
    // In a real app, this would insert to the database
    // For now, create a new quiz with mock data
    
    // Find the highest quiz_id to generate a new unique ID
    const maxQuizId = Math.max(...dummyQuizzes.map(q => q.quiz_id), 0);
    const newQuizId = maxQuizId + 1;
    
    // Create new quiz object
    const newQuiz = {
      quiz_id: newQuizId,
      student_id,
      title,
      description: description || null,
      created_at: new Date().toISOString(),
      is_public: is_public || false,
      questions_count: questions.length,
      questions: questions.map((q, index) => ({
        question_id: newQuizId * 100 + index + 1, // Generate unique IDs for questions
        quiz_id: newQuizId,
        question_type: q.question_type,
        content: q.content,
        correct_answer: q.correct_answer,
        options: q.options
      }))
    };
    
    // Add to dummy data (in-memory only)
    dummyQuizzes.push(newQuiz);
    
    // Return the newly created quiz without questions
    const { questions: _, ...quizData } = newQuiz;
    return NextResponse.json(quizData);
    
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}