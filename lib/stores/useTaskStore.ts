"use client";

import { create } from "zustand";
import { Task } from "@/db/types";
import { TaskFormData } from "@/app/dashboard/tasks/edit-task-form";
import {
  fetchTasks as fetchTasksApi,
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
} from "@/app/services/taskService";
import { useUserStore } from "./useUserStore";

interface TaskOperations {
  [id: number]: Set<"deleting" | "editing" | "completing">;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  operationInProgress: TaskOperations;
  selectedTask: Task | null;

  // Actions
  fetchTasks: (studentId?: number) => Promise<void>;
  createTask: (data: TaskFormData) => Promise<void>;
  updateTask: (id: number, data: TaskFormData) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setSelectedTask: (task: Task | null) => void;
  clearError: () => void;

  // Operation tracking helpers
  startOperation: (
    taskId: number,
    operation: "deleting" | "editing" | "completing"
  ) => void;
  endOperation: (
    taskId: number,
    operation: "deleting" | "editing" | "completing"
  ) => void;
  isOperationInProgress: (
    taskId: number,
    operation: "deleting" | "editing" | "completing"
  ) => boolean;
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  operationInProgress: {},
  selectedTask: null,

  fetchTasks: async (studentId) => {
    try {
      set({ isLoading: true, error: null });

      const tasks = await fetchTasksApi(studentId);

      set({ tasks });
    } catch (err) {
      console.error("Error fetching tasks:", err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (data) => {
    try {
      set({ isLoading: true, error: null });

      // Get the studentId from the user store
      const { user } = useUserStore.getState();
      if (!user || !user.studentId) {
        throw new Error("User is not authenticated");
      }

      // Add student_id to the task data
      const taskData = {
        ...data,
        student_id: user.studentId,
      };

      const newTask = await createTaskApi(taskData);

      set((state) => ({
        tasks: [...state.tasks, newTask],
      }));
    } catch (err) {
      console.error("Error creating task:", err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (id, data) => {
    const { startOperation, endOperation } = get();
    try {
      startOperation(id, "editing");
      set({ error: null });

      const updatedTask = await updateTaskApi(id, data);

      // Update the state with the updated task data from the server
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        // If the updated task is the selected task, update the selected task as well
        selectedTask: state.selectedTask?.id === id ? updatedTask : state.selectedTask,
      }));
      
      return updatedTask;
    } catch (err) {
      console.error(`Error updating task ${id}:`, err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
      throw err;
    } finally {
      endOperation(id, "editing");
    }
  },

  deleteTask: async (id) => {
    const { startOperation, endOperation } = get();
    try {
      startOperation(id, "deleting");
      set({ error: null });

      await deleteTaskApi(id);

      // Update the state by removing the deleted task
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
      }));
    } catch (err) {
      console.error(`Error deleting task ${id}:`, err);
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
      throw err;
    } finally {
      endOperation(id, "deleting");
    }
  },

  setSelectedTask: (task) => set({ selectedTask: task }),

  clearError: () => set({ error: null }),

  // Operation tracking methods
  startOperation: (taskId, operation) => {
    set((state) => {
      const currentOps = state.operationInProgress[taskId] || new Set();
      currentOps.add(operation);

      return {
        operationInProgress: {
          ...state.operationInProgress,
          [taskId]: currentOps,
        },
      };
    });
  },

  endOperation: (taskId, operation) => {
    set((state) => {
      const currentOps = state.operationInProgress[taskId];
      if (!currentOps) return state;

      currentOps.delete(operation);

      const newOps = { ...state.operationInProgress };
      if (currentOps.size === 0) {
        delete newOps[taskId];
      } else {
        newOps[taskId] = currentOps;
      }

      return { operationInProgress: newOps };
    });
  },

  isOperationInProgress: (taskId, operation) => {
    const { operationInProgress } = get();
    return !!operationInProgress[taskId]?.has(operation);
  },
}));
