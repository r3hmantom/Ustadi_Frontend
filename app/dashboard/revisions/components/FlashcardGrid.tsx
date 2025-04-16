import React from "react";
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash, Clock, TagIcon } from "lucide-react";
import { Flashcard } from "../types";

interface FlashcardGridProps {
  flashcards: Flashcard[];
  onReview: (flashcard: Flashcard) => void;
  onDelete: (flashcardId: number) => void;
}

const FlashcardGrid: React.FC<FlashcardGridProps> = ({ 
  flashcards, 
  onReview,
  onDelete
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const isDue = (nextReviewDate: string) => {
    const reviewDate = new Date(nextReviewDate);
    const now = new Date();
    return reviewDate <= now;
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {flashcards.map(flashcard => (
        <Card 
          key={flashcard.flashcard_id} 
          className={`border-3 rounded-md ${isDue(flashcard.next_review_date) ? 
            'border-orange-400 bg-orange-50' : 
            'border-gray-200 bg-white'}`}
        >
          <CardContent className="p-4">
            <div className="text-lg font-medium mb-2 min-h-[60px] line-clamp-2">
              {flashcard.front_content}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-gray-500" size={14} />
              <span className="text-sm text-gray-600">
                {isDue(flashcard.next_review_date) 
                  ? 'Due now' 
                  : `Next review: ${formatDate(flashcard.next_review_date)}`
                }
              </span>
            </div>
            
            {flashcard.tags && flashcard.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {flashcard.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t border-gray-200 p-3 flex justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              onClick={() => onReview(flashcard)}
            >
              <Eye size={16} className="mr-1" /> Review
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(flashcard.flashcard_id)}
            >
              <Trash size={16} />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FlashcardGrid;