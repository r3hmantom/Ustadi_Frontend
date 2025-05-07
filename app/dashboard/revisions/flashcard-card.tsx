import { Flashcard } from "@/db/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface FlashcardCardProps {
  flashcard: any; // Accept either database-style or store-style flashcard
  onEdit: (flashcard: any) => void;
  onDelete: (flashcard: any) => void;
  onPractice: (flashcard: any) => void;
  isDeleting?: boolean;
}

const FlashcardCard = ({
  flashcard,
  onEdit,
  onDelete,
  onPractice,
  isDeleting = false,
}: FlashcardCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Handle either database field names or store field names
  const frontContent = flashcard.front_content || flashcard.question || "";
  const backContent = flashcard.back_content || flashcard.answer || "";
  const nextReviewDate = flashcard.next_review_date || "";

  // Format the next review date as a relative time (if it exists)
  const nextReviewRelative = nextReviewDate
    ? formatDistanceToNow(new Date(nextReviewDate), {
        addSuffix: true,
      })
    : "Not scheduled";

  return (
    <Card
      className="h-full overflow-hidden cursor-pointer transition-all duration-300"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative transition-transform duration-300 transform-gpu ${isFlipped ? "rotate-y-180" : ""}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front side */}
        <div
          className={`${isFlipped ? "invisible" : "visible"} h-full flex flex-col`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Flashcard</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-center font-medium whitespace-pre-wrap">
              {frontContent}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between py-2 text-xs text-muted-foreground">
            <span>Click to flip</span>
            <span>Next review: {nextReviewRelative}</span>
          </CardFooter>
        </div>

        {/* Back side */}
        <div
          className={`${isFlipped ? "visible" : "invisible"} absolute inset-0 h-full flex flex-col rotate-y-180`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Answer</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-center font-medium whitespace-pre-wrap">
              {backContent}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between py-2 gap-2">
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(flashcard);
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(flashcard);
                }}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
            <Button
              size="sm"
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                onPractice(flashcard);
              }}
            >
              Practice
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default FlashcardCard;
