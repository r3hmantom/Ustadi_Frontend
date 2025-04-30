// Shared types for the Tasks API and service

// API Response interface used across all API endpoints
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
}

// Base Task interface with common properties
export interface BaseTask {
  task_id: number;
  student_id: number;
  title: string;
  description: string | null;
  priority: number | null;
  recurrence_pattern: string | null;
  parent_task_id: number | null;
  is_recurring: boolean;
}

// Backend Task interface (using Date objects)
export interface TaskDB extends BaseTask {
  due_date: Date | null;
  created_at: Date;
  completed_at: Date | null;
}

// Frontend Task interface (using string representations of dates)
export interface TaskUI extends BaseTask {
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
}

// Payload for creating a task
export interface CreateTaskPayload {
  student_id: number;
  title: string;
  description?: string | null;
  due_date?: string | null;
  priority?: number | null;
  recurrence_pattern?: string | null;
  parent_task_id?: number | null;
  is_recurring?: boolean | null;
}

// Form data for creating a task in the UI
export interface NewTaskForm {
  title: string;
  description: string;
  due_date: string;
  priority: number;
  is_recurring: boolean;
  // Add other fields like recurrence_pattern, parent_task_id if needed
}
