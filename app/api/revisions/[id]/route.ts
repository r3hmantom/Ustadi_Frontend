import { NextRequest, NextResponse } from "next/server";
import { dummyFlashcards, calculateNextInterval } from "@/lib/dummy-flashcards";
import { Flashcard } from "../route";

// GET a specific flashcard by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const flashcardId = parseInt(params.id);
    
    if (isNaN(flashcardId)) {
      return NextResponse.json(
        { error: "Invalid flashcard ID" },
        { status: 400 }
      );
    }
    
    // Find flashcard in dummy data
    const flashcard = dummyFlashcards.find(card => card.flashcard_id === flashcardId);
    
    if (!flashcard) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(flashcard);
  } catch (error) {
    console.error("Error fetching flashcard:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcard" },
      { status: 500 }
    );
  }
}

// PUT to update a flashcard
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const flashcardId = parseInt(params.id);
    
    if (isNaN(flashcardId)) {
      return NextResponse.json(
        { error: "Invalid flashcard ID" },
        { status: 400 }
      );
    }
    
    // Find flashcard in dummy data
    const cardIndex = dummyFlashcards.findIndex(card => card.flashcard_id === flashcardId);
    
    if (cardIndex === -1) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }
    
    const body = await req.json();
    const {
      front_content,
      back_content,
      tags,
      review_quality,
    } = body;
    
    // Update flashcard
    const updatedCard = { ...dummyFlashcards[cardIndex] };
    
    if (front_content !== undefined) {
      updatedCard.front_content = front_content;
    }
    
    if (back_content !== undefined) {
      updatedCard.back_content = back_content;
    }
    
    if (tags !== undefined) {
      updatedCard.tags = tags;
    }
    
    // If the request includes a review quality, update spaced repetition parameters
    if (review_quality !== undefined) {
      const { newIntervalDays, newEaseFactor } = calculateNextInterval(
        updatedCard.interval_days,
        updatedCard.ease_factor,
        review_quality
      );
      
      updatedCard.interval_days = newIntervalDays;
      updatedCard.ease_factor = newEaseFactor;
      
      // Calculate next review date based on new interval
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + newIntervalDays);
      updatedCard.next_review_date = nextReviewDate.toISOString();
    }
    
    // Update in dummy data (in-memory only)
    dummyFlashcards[cardIndex] = updatedCard;
    
    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("Error updating flashcard:", error);
    return NextResponse.json(
      { error: "Failed to update flashcard" },
      { status: 500 }
    );
  }
}

// DELETE a flashcard
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const flashcardId = parseInt(params.id);
    
    if (isNaN(flashcardId)) {
      return NextResponse.json(
        { error: "Invalid flashcard ID" },
        { status: 400 }
      );
    }
    
    // Find flashcard in dummy data
    const cardIndex = dummyFlashcards.findIndex(card => card.flashcard_id === flashcardId);
    
    if (cardIndex === -1) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }
    
    // Remove from dummy data (in-memory only)
    const deletedCard = dummyFlashcards.splice(cardIndex, 1)[0];
    
    return NextResponse.json({
      message: "Flashcard deleted successfully",
      flashcardId
    });
    
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    return NextResponse.json(
      { error: "Failed to delete flashcard" },
      { status: 500 }
    );
  }
}