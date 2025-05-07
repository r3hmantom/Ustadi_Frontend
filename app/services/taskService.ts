import { Task } from "@/db/types";
import { TaskFormData } from "../dashboard/tasks/edit-task-form";
import { api } from "@/lib/api";

/**
 * Fetches tasks for a specific student
 */
export const fetchTasks = async (
  studentId: number | undefined
): Promise<Task[]> => {
  if (!studentId) {
    return [];
  }

  try {
    return await api.get<Task[]>("/api/tasks", {
      student_id: studentId.toString(),
    });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw error;
  }
};

/**
 * Fetches a single task by ID
 */
export const fetchTask = async (taskId: number): Promise<Task> => {
  try {
    return await api.get<Task>(`/api/tasks/${taskId}`);
  } catch (error) {
    console.error(`Failed to fetch task ${taskId}:`, error);
    throw error;
  }
};

/**
 * Creates a new task
 */
export const createTask = async (data: TaskFormData & { student_id?: number }): Promise<Task> => {
  try {
    return await api.post<Task>("/api/tasks", data);
  } catch (error) {
    console.error("Failed to create task:", error);
    throw error;
  }
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
  data: Partial<TaskFormData>
): Promise<Task> => {
  try {
    return await api.patch<Task>(`/api/tasks/${taskId}`, data);
  } catch (error) {
    console.error(`Failed to update task ${taskId}:`, error);
    throw error;
  }
};

/**
 * Deletes a task
 */
export const deleteTask = async (taskId: number): Promise<void> => {
  try {
    await api.delete(`/api/tasks/${taskId}`);
  } catch (error) {
    console.error(`Failed to delete task ${taskId}:`, error);
    throw error;
  }
};
