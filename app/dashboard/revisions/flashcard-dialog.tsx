import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Flashcard } from "@/db/types";
import { useState } from "react";
import { FlashcardFormData } from "@/app/services/flashcardService";

interface FlashcardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FlashcardFormData) => Promise<void>;
  flashcard?: Flashcard;
  title?: string;
  isSubmitting?: boolean;
}

const FlashcardDialog = ({
  open,
  onOpenChange,
  onSubmit,
  flashcard,
  title = "Flashcard",
  isSubmitting = false,
}: FlashcardDialogProps) => {
  const [frontContent, setFrontContent] = useState(
    flashcard?.front_content || ""
  );
  const [backContent, setBackContent] = useState(flashcard?.back_content || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!frontContent.trim()) {
      setError("Front content is required");
      return;
    }

    if (!backContent.trim()) {
      setError("Back content is required");
      return;
    }

    try {
      await onSubmit({
        front_content: frontContent,
        back_content: backContent,
      });

      // Reset form and close dialog on success
      setFrontContent("");
      setBackContent("");
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Create a new flashcard to help with your revisions. Add question
              on the front and answer on the back.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <p className="text-sm font-medium text-destructive mb-4">{error}</p>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="front-content">Question (Front)</Label>
              <Textarea
                id="front-content"
                value={frontContent}
                onChange={(e) => setFrontContent(e.target.value)}
                placeholder="Enter the question or prompt"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="back-content">Answer (Back)</Label>
              <Textarea
                id="back-content"
                value={backContent}
                onChange={(e) => setBackContent(e.target.value)}
                placeholder="Enter the answer or content for the back"
                rows={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Flashcard"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FlashcardDialog;
