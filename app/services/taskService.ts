// Task API service to handle all task-related API calls
import { TaskUI, ApiResponse, CreateTaskPayload } from "@/lib/types";

// Use the shared TaskUI interface for frontend tasks
export type Task = TaskUI;

/**
 * Fetches tasks for a specific student
 */
export const fetchTasks = async (studentId: number): Promise<Task[]> => {
  const response = await fetch(`/api/tasks?student_id=${studentId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData?.error?.message ||
        `Failed to fetch tasks: ${response.statusText}`
    );
  }

  const result: ApiResponse<Task[]> = await response.json();

  if (result.success && result.data) {
    return result.data;
  } else {
    throw new Error(result.error?.message || "Failed to fetch tasks");
  }
};

/**
 * Creates a new task
 */
export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<Task> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message || `Failed to create task: ${response.statusText}`
    );
  }

  return result.data!;
};

/**
 * Interface for task update payload
 */
export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  due_date?: string | null;
  priority?: number | null;
  recurrence_pattern?: string | null;
  parent_task_id?: number | null;
  is_recurring?: boolean;
  completed_at?: string | null;
}

/**
 * Updates an existing task
 */
export const updateTask = async (
  taskId: number,
  payload: UpdateTaskPayload
): Promise<Task> => {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<Task> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message || `Failed to update task: ${response.statusText}`
    );
  }

  return result.data!;
};

/**
 * Deletes a task by ID
 */
export const deleteTask = async (taskId: number): Promise<Task> => {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result: ApiResponse<Task> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message || `Failed to delete task: ${response.statusText}`
    );
  }

  return result.data!;
};
