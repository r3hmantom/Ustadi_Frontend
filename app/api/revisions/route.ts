import { NextRequest, NextResponse } from "next/server";
import { dummyFlashcards } from "@/lib/dummy-flashcards";

// Define types based on the SQL schema
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

// GET handler to retrieve all flashcards with optional filters
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    
    // In a real app, get student_id from session/auth
    // For now, we'll use a query param or default to 1 for testing
    const student_id = parseInt(searchParams.get("student_id") || "1");
    
    // Filter options
    const due = searchParams.get("due") === "true";
    const tag = searchParams.get("tag");
    const searchQuery = searchParams.get("search");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") || "0") : null;
    
    // Clone the flashcards to avoid modifying the original
    let filteredFlashcards = [...dummyFlashcards];
    
    // Apply filters
    
    // Filter by student ID
    filteredFlashcards = filteredFlashcards.filter(card => card.student_id === student_id);
    
    // Filter by due date if requested
    if (due) {
      const now = new Date();
      filteredFlashcards = filteredFlashcards.filter(card => {
        const reviewDate = new Date(card.next_review_date);
        return reviewDate <= now;
      });
    }
    
    // Filter by tag if specified
    if (tag) {
      filteredFlashcards = filteredFlashcards.filter(card => 
        card.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }
    
    // Filter by search query if specified
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredFlashcards = filteredFlashcards.filter(card => 
        card.front_content.toLowerCase().includes(query) || 
        card.back_content.toLowerCase().includes(query)
      );
    }
    
    // Apply limit if specified
    if (limit && limit > 0) {
      filteredFlashcards = filteredFlashcards.slice(0, limit);
    }
    
    return NextResponse.json(filteredFlashcards);
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcards" },
      { status: 500 }
    );
  }
}

// POST handler to create a new flashcard
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      student_id,
      front_content,
      back_content,
      tags = []
    } = body;
    
    // Validate required fields
    if (!student_id || !front_content || !back_content) {
      return NextResponse.json(
        { error: "Student ID, front content, and back content are required" },
        { status: 400 }
      );
    }
    
    // Find the highest flashcard_id to generate a new unique ID
    const maxFlashcardId = dummyFlashcards.reduce((max, card) => 
      Math.max(max, card.flashcard_id), 0);
    
    // Create new flashcard with default spaced repetition values
    const newFlashcard: Flashcard = {
      flashcard_id: maxFlashcardId + 1,
      student_id,
      front_content,
      back_content,
      next_review_date: new Date().toISOString(), // Due immediately for first review
      interval_days: 1, // Start with 1-day interval
      ease_factor: 2.5, // Default ease factor
      created_at: new Date().toISOString(),
      tags
    };
    
    // Add to dummy data (in-memory only)
    dummyFlashcards.push(newFlashcard);
    
    return NextResponse.json(newFlashcard);
  } catch (error) {
    console.error("Error creating flashcard:", error);
    return NextResponse.json(
      { error: "Failed to create flashcard" },
      { status: 500 }
    );
  }
}