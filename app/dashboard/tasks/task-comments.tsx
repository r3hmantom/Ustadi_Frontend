"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { CommentList } from "./comment-list";
import { CreateCommentForm } from "./create-comment-form";
import {
  CommentWithAuthor,
  CommentFormData,
  fetchComments,
  createComment,
} from "@/app/services/commentService";

interface TaskCommentsProps {
  taskId: number;
  studentId: number | undefined;
}

export const TaskComments = ({ taskId, studentId }: TaskCommentsProps) => {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  // Fetch comments for the task
  const loadComments = useCallback(async () => {
    if (!taskId) return;

    setIsLoading(true);
    setError(null);

    try {
      const commentsData = await fetchComments(taskId);
      setComments(commentsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Fetch comments error:", err);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Handle adding a new comment
  const handleAddComment = async (
    formData: CommentFormData & { task_id: number; student_id: number }
  ) => {
    try {
      await createComment(formData);
      // We need to fetch the updated comment to get the author name
      await loadComments();

      toast.success("Comment added successfully");
    } catch (err) {
      console.error("Add comment error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to add comment");
      throw err;
    }
  };

  // Handle deleting a comment
  const handleCommentDeleted = (commentId: number) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.comment_id !== commentId)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        <h3 className="text-sm font-medium">Comments ({comments.length})</h3>
      </div>

      <CommentList
        comments={comments}
        isLoading={isLoading}
        studentId={studentId}
        onCommentDeleted={handleCommentDeleted}
      />

      <CreateCommentForm
        taskId={taskId}
        studentId={studentId}
        onSubmit={handleAddComment}
      />
    </div>
  );
};
