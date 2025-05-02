"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CommentWithAuthor,
  deleteComment,
} from "@/app/services/commentService";
import { toast } from "sonner";

interface CommentListProps {
  comments: CommentWithAuthor[];
  isLoading: boolean;
  studentId: number | undefined;
  onCommentDeleted: (commentId: number) => void;
}

export const CommentList = ({
  comments,
  isLoading,
  studentId,
  onCommentDeleted,
}: CommentListProps) => {
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No comments yet.
      </p>
    );
  }

  const handleDelete = async (commentId: number) => {
    try {
      setProcessingIds((prev) => [...prev, commentId]);
      await deleteComment(commentId);
      onCommentDeleted(commentId);
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete comment"
      );
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== commentId));
    }
  };

  return (
    <div className="space-y-3 mt-2">
      {comments.map((comment) => {
        const isOwnComment = studentId === comment.student_id;
        const isProcessing = processingIds.includes(comment.comment_id);

        return (
          <Card key={comment.comment_id} className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{comment.student_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                {isOwnComment && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleDelete(comment.comment_id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </div>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {comment.content}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
