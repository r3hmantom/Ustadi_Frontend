import { Task } from "@/db/types";
import { TaskFormData } from "../dashboard/tasks/edit-task-form";

/**
 * Fetches tasks for a specific student
 */
export const fetchTasks = async (
  studentId: number | undefined
): Promise<Task[]> => {
  if (!studentId) {
    return [];
  }

  const response = await fetch(`/api/tasks?student_id=${studentId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData?.error?.message ||
        `Failed to fetch tasks: ${response.statusText}`
    );
  }

  const result = await response.json();

  if (result.success && result.data) {
    return result.data;
  } else {
    throw new Error(result.error?.message || "Failed to fetch tasks");
  }
};

/**
 * Creates a new task
 */
export const createTask = async (
  payload: TaskFormData & { student_id?: number }
): Promise<Task> => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message || `Failed to create task: ${response.statusText}`
    );
  }

  return result.data!;
};

/**
 * Interface for task update payload - can be partial fields of a task
 */
export type TaskUpdatePayload = Partial<TaskFormData> & {
  completed_at?: string | null;
};

/**
 * Updates an existing task
 */
export const updateTask = async (
  taskId: number,
  payload: TaskUpdatePayload
): Promise<Task> => {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

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

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message || `Failed to delete task: ${response.statusText}`
    );
  }

  return result.data!;
};
