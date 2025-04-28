import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XIcon, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { Flashcard, ReviewQuality } from "../types";

interface FlashcardReviewModalProps {
  flashcard: Flashcard;
  onClose: () => void;
  onComplete: (flashcardId: number, quality: number) => Promise<void>;
}

const FlashcardReviewModal: React.FC<FlashcardReviewModalProps> = ({
  flashcard,
  onClose,
  onComplete
}) => {
  const [flipped, setFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  const handleRating = async (quality: ReviewQuality) => {
    setIsSubmitting(true);
    
    try {
      await onComplete(flashcard.flashcard_id, quality);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="border-b-4 border-black flex justify-between items-center">
          <CardTitle>Review Flashcard</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onClose}
          >
            <XIcon size={16} />
          </Button>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div 
              className={`w-full border-3 border-black rounded-lg cursor-pointer transition-all duration-300 flex justify-center items-center p-6 min-h-[200px] ${
                flipped ? 'bg-blue-50' : 'bg-white'
              }`}
              onClick={handleFlip}
            >
              <div className="text-center">
                {flipped ? (
                  <div className="text-lg">{flashcard.back_content}</div>
                ) : (
                  <div className="text-lg">{flashcard.front_content}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <Button
              variant="outline"
              className="mx-auto flex items-center gap-1"
              onClick={handleFlip}
            >
              <RefreshCw size={16} />
              {flipped ? 'Show Question' : 'Show Answer'}
            </Button>
          </div>
        </CardContent>
        
        {flipped && (
          <CardFooter className="flex flex-col border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-4">
              How well did you remember this? Rate your recall:
            </p>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="border-red-300 hover:bg-red-50 text-red-600"
                disabled={isSubmitting}
                onClick={() => handleRating(1)}
              >
                <ThumbsDown className="mr-1" size={16} /> Hard
              </Button>
              
              <Button
                variant="outline"
                className="border-yellow-300 hover:bg-yellow-50 text-yellow-600"
                disabled={isSubmitting}
                onClick={() => handleRating(3)}
              >
                Okay
              </Button>
              
              <Button
                variant="outline"
                className="border-green-300 hover:bg-green-50 text-green-600"
                disabled={isSubmitting}
                onClick={() => handleRating(5)}
              >
                <ThumbsUp className="mr-1" size={16} /> Easy
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default FlashcardReviewModal;