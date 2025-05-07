import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Flashcard } from "@/db/types";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { practiceFlashcard } from "@/app/services/flashcardService";
import { toast } from "sonner";

interface PracticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard: any | null; // Accept either data format
  onComplete: (updatedFlashcard: any) => void;
}

const PracticeDialog = ({
  open,
  onOpenChange,
  flashcard,
  onComplete,
}: PracticeDialogProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when dialog opens with new flashcard
  useEffect(() => {
    if (open) {
      setIsFlipped(false);
      setIsSubmitting(false);
    }
  }, [open, flashcard]);

  // Handle either data format
  const getFlashcardId = () => {
    if (!flashcard) return null;
    return flashcard.flashcard_id || flashcard.id;
  };

  const frontContent = flashcard?.front_content || flashcard?.question || "";
  const backContent = flashcard?.back_content || flashcard?.answer || "";

  // Handle quality rating (1-5) submission
  const handleRateRecall = async (quality: number) => {
    const flashcardId = getFlashcardId();
    
    if (!flashcardId) {
      toast.error("No flashcard selected");
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedFlashcard = await practiceFlashcard(
        flashcardId,
        quality
      );
      toast.success("Practice recorded successfully");
      onComplete(updatedFlashcard);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to record practice");
      console.error("Practice error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Practice Flashcard</DialogTitle>
        </DialogHeader>

        {!flashcard ? (
          <div className="py-6 text-center">
            <p>No flashcard selected for practice.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6 pt-4 pb-6">
            <div className="w-full bg-card border rounded-lg p-6 min-h-[200px] flex flex-col justify-center items-center">
              {!isFlipped ? (
                <div className="text-center">
                  <h3 className="font-semibold mb-4">Question</h3>
                  <p className="whitespace-pre-wrap">
                    {frontContent}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="font-semibold mb-4">Answer</h3>
                  <p className="whitespace-pre-wrap">
                    {backContent}
                  </p>
                </div>
              )}
            </div>

            {!isFlipped ? (
              <Button onClick={() => setIsFlipped(true)} size="lg">
                Show Answer
              </Button>
            ) : (
              <div className="space-y-4 w-full">
                <h3 className="text-center font-medium">
                  How well did you know this?
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-destructive border-destructive cursor-pointer hover:bg-destructive/10 px-4 py-2"
                    onClick={() => handleRateRecall(1)}
                    disabled={isSubmitting}
                  >
                    1 - Did not know at all
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted px-4 py-2"
                    onClick={() => handleRateRecall(2)}
                    disabled={isSubmitting}
                  >
                    2 - Barely remembered
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted px-4 py-2"
                    onClick={() => handleRateRecall(3)}
                    disabled={isSubmitting}
                  >
                    3 - Struggled but recalled
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-primary border-primary cursor-pointer hover:bg-primary/10 px-4 py-2"
                    onClick={() => handleRateRecall(4)}
                    disabled={isSubmitting}
                  >
                    4 - Recalled after a moment
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600 cursor-pointer hover:bg-green-600/10 px-4 py-2"
                    onClick={() => handleRateRecall(5)}
                    disabled={isSubmitting}
                  >
                    5 - Perfect recall
                  </Badge>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PracticeDialog;
