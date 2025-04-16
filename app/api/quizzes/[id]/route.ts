import { NextRequest, NextResponse } from "next/server";
import { executeQuery, withTransaction } from "@/lib/db";
import { Quiz, Question } from "../route";
import { dummyQuizzes } from "@/lib/dummy-quizzes";

// GET a specific quiz by ID
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
    
    // Return the quiz data with questions
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

// PUT to update a quiz
export async function PUT(
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
    
    const body = await req.json();
    const { title, description, is_public } = body;
    
    // Find quiz in dummy data
    const quizIndex = dummyQuizzes.findIndex(q => q.quiz_id === quizId);
    
    if (quizIndex === -1) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }
    
    // Update quiz data
    const updatedQuiz = {
      ...dummyQuizzes[quizIndex]
    };
    
    if (title !== undefined) {
      updatedQuiz.title = title;
    }
    
    if (description !== undefined) {
      updatedQuiz.description = description;
    }
    
    if (is_public !== undefined) {
      updatedQuiz.is_public = is_public;
    }
    
    // Update in dummy data (in-memory only)
    dummyQuizzes[quizIndex] = updatedQuiz;
    
    // Return the updated quiz without questions
    const { questions, ...quizData } = updatedQuiz;
    return NextResponse.json(quizData);
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}

// DELETE a quiz
export async function DELETE(
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
    
    // Remove from dummy data (in-memory only)
    dummyQuizzes.splice(quizIndex, 1);
    
    return NextResponse.json({
      message: "Quiz deleted successfully",
      quizId
    });
    
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}