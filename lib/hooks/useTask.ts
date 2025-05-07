"use client";

import { useEffect } from "react";
import { useTaskStore } from "../stores/useTaskStore";
import { useUserStore } from "../stores/useUserStore";

export function useTask() {
  const {
    tasks,
    isLoading,
    error,
    selectedTask,
    operationInProgress,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setSelectedTask,
    clearError,
    isOperationInProgress,
  } = useTaskStore();

  const { user } = useUserStore();
  const studentId = user?.studentId;

  useEffect(() => {
    if (studentId) {
      fetchTasks(studentId);
    }
  }, [studentId, fetchTasks]);

  // Filter tasks by status using completed_at
  const activeTasks = tasks.filter((task) => !task.completed_at);
  const completedTasks = tasks.filter((task) => task.completed_at);

  return {
    tasks,
    activeTasks,
    completedTasks,
    isLoading,
    error,
    selectedTask,
    operationInProgress,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setSelectedTask,
    clearError,
    isOperationInProgress,
  };
}

export default useTask;
