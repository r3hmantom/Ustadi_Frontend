import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { Question } from "../../route";
import { dummyQuizzes } from "@/lib/dummy-quizzes";

// GET questions for a specific quiz
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = parseInt(params.id);
    
    if (isNaN(quizId)) {
      return NextResponse.json(
        { error: "Invalid quiz ID" },
        { status: 400 }
      );
    }
    
    // In a real app, this would query the database
    // For now, use dummy data
    const quiz = dummyQuizzes.find(q => q.quiz_id === quizId);
    
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }
    
    // Return the questions for this quiz
    return NextResponse.json(quiz.questions || []);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// POST to add a new question to a quiz
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = parseInt(params.id);
    
    if (isNaN(quizId)) {
      return NextResponse.json(
        { error: "Invalid quiz ID" },
        { status: 400 }
      );
    }
    
    // Find quiz in dummy data
    const quizIndex = dummyQuizzes.findIndex(q => q.quiz_id === quizId);
    
    if (quizIndex === -1) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }
    
    const body = await req.json();
    const { question_type, content, correct_answer, options } = body;
    
    // Validate required fields
    if (!question_type || !content || !correct_answer) {
      return NextResponse.json(
        { error: "Question type, content, and correct answer are required" },
        { status: 400 }
      );
    }
    
    // For MCQ questions, options are also required
    if (question_type === "MCQ" && (!options || !Array.isArray(options) || options.length < 2)) {
      return NextResponse.json(
        { error: "MCQ questions must have at least 2 options" },
        { status: 400 }
      );
    }
    
    // Find the highest question_id to generate a new unique ID
    const maxQuestionId = dummyQuizzes.reduce((max, quiz) => {
      const quizMax = quiz.questions?.reduce((qMax, q) => Math.max(qMax, q.question_id), 0) || 0;
      return Math.max(max, quizMax);
    }, 0);
    
    // Create new question
    const newQuestion = {
      question_id: maxQuestionId + 1,
      quiz_id: quizId,
      question_type,
      content,
      correct_answer,
      options
    };
    
    // Add question to quiz
    const updatedQuiz = {
      ...dummyQuizzes[quizIndex],
      questions_count: (dummyQuizzes[quizIndex].questions_count || 0) + 1,
      questions: [...(dummyQuizzes[quizIndex].questions || []), newQuestion]
    };
    
    // Update in dummy data (in-memory only)
    dummyQuizzes[quizIndex] = updatedQuiz;
    
    return NextResponse.json(newQuestion);
  } catch (error) {
    console.error("Error adding question:", error);
    return NextResponse.json(
      { error: "Failed to add question" },
      { status: 500 }
    );
  }
}