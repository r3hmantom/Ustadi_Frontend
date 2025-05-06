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
  flashcard: Flashcard;
  onEdit: (flashcard: Flashcard) => void;
  onDelete: (flashcard: Flashcard) => void;
  onPractice: (flashcard: Flashcard) => void;
}

const FlashcardCard = ({
  flashcard,
  onEdit,
  onDelete,
  onPractice,
}: FlashcardCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Format the next review date as a relative time
  const nextReviewRelative = formatDistanceToNow(
    new Date(flashcard.next_review_date),
    {
      addSuffix: true,
    }
  );

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
              {flashcard.front_content}
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
              {flashcard.back_content}
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
              >
                Delete
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
