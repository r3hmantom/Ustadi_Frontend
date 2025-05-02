"use client";

import { useState, FormEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CommentFormData } from "@/app/services/commentService";

interface CreateCommentFormProps {
  taskId: number;
  studentId: number | undefined;
  onSubmit: (
    formData: CommentFormData & { task_id: number; student_id: number }
  ) => Promise<void>;
}

export const CreateCommentForm = ({
  taskId,
  studentId,
  onSubmit,
}: CreateCommentFormProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!content.trim() || !studentId) {
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit({
        content: content.trim(),
        task_id: taskId,
        student_id: studentId,
      });

      // Reset form after successful submission
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting || !studentId}
            rows={2}
            className="min-h-[60px] resize-none"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim() || !studentId}
              size="sm"
              className="gap-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-3 w-3" />
                  <span>Send</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
