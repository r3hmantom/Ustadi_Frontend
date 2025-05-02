import { Comment } from "@/db/types";

/**
 * Extended Comment type that includes student name for display purposes
 */
export interface CommentWithAuthor extends Comment {
  student_name: string;
}

/**
 * Interface for comment creation payload
 */
export interface CommentFormData {
  content: string;
  parent_comment_id?: number | null;
}

/**
 * Fetches comments for a specific task
 */
export const fetchComments = async (
  taskId: number | undefined
): Promise<CommentWithAuthor[]> => {
  if (!taskId) {
    return [];
  }

  const response = await fetch(`/api/comments?task_id=${taskId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData?.error?.message ||
        `Failed to fetch comments: ${response.statusText}`
    );
  }

  const result = await response.json();

  if (result.success && result.data) {
    return result.data;
  } else {
    throw new Error(result.error?.message || "Failed to fetch comments");
  }
};

/**
 * Creates a new comment
 */
export const createComment = async (
  payload: CommentFormData & {
    task_id: number;
    student_id: number;
  }
): Promise<Comment> => {
  const response = await fetch("/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message ||
        `Failed to create comment: ${response.statusText}`
    );
  }

  return result.data!;
};

/**
 * Deletes a comment by ID
 */
export const deleteComment = async (commentId: number): Promise<Comment> => {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message ||
        `Failed to delete comment: ${response.statusText}`
    );
  }

  return result.data!;
};
