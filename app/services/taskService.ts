import { Task } from "@/db/types";
import { TaskFormData, RECURRENCE_PATTERNS } from "../dashboard/tasks/edit-task-form";
import { api } from "@/lib/api";
import { addDays, addWeeks, addMonths } from "date-fns";

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

/**
 * Calculate the next due date based on a recurrence pattern
 */
export const calculateNextDueDate = (
  currentDueDate: Date | string | null,
  recurrencePattern: string
): Date => {
  // If no current due date, use today as base
  const baseDate = currentDueDate ? new Date(currentDueDate) : new Date();
  
  switch (recurrencePattern) {
    case RECURRENCE_PATTERNS.DAILY:
      return addDays(baseDate, 1);
    
    case RECURRENCE_PATTERNS.WEEKLY:
      return addWeeks(baseDate, 1);
    
    case RECURRENCE_PATTERNS.BIWEEKLY:
      return addWeeks(baseDate, 2);
    
    case RECURRENCE_PATTERNS.MONTHLY:
      return addMonths(baseDate, 1);
    
    case RECURRENCE_PATTERNS.CUSTOM:
      // Default to weekly for custom patterns until custom logic is implemented
      return addWeeks(baseDate, 1);
    
    default:
      // Default to weekly for unknown patterns
      return addWeeks(baseDate, 1);
  }
};

/**
 * Complete a task and create the next instance if it's recurring
 */
export const completeTask = async (taskId: number): Promise<{ completed: Task, next?: Task }> => {
  try {
    // Mark current task as completed
    const completedTask = await api.patch<Task>(`/api/tasks/${taskId}`, {
      completed_at: new Date().toISOString(),
    });
    
    // If the task is recurring, create the next instance
    if (completedTask.is_recurring && completedTask.recurrence_pattern) {
      // Calculate next due date
      const nextDueDate = calculateNextDueDate(
        completedTask.due_date,
        completedTask.recurrence_pattern
      );
      
      // Create a new task with incremented data
      const nextTask = await api.post<Task>("/api/tasks", {
        student_id: completedTask.student_id,
        title: completedTask.title,
        description: completedTask.description,
        due_date: nextDueDate.toISOString(),
        priority: completedTask.priority,
        recurrence_pattern: completedTask.recurrence_pattern,
        is_recurring: true,
        parent_task_id: completedTask.task_id, // Link to parent
      });
      
      return { completed: completedTask, next: nextTask };
    }
    
    return { completed: completedTask };
  } catch (error) {
    console.error(`Failed to complete task ${taskId}:`, error);
    throw error;
  }
};
