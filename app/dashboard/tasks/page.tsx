"use client";

import { useState, useEffect, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/app/services/taskService";
import { EditTaskForm, TaskFormData } from "./edit-task-form";
import { TaskList } from "./task-list";
import useUser from "@/lib/hooks/useUser";
import { Task } from "@/db/types";

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { user } = useUser();
  const studentId = user?.studentId;

  // Fetch tasks on component mount
  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const taskData = await fetchTasks(studentId);
      setTasks(taskData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Fetch tasks error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]); // Re-fetch if loadTasks changes

  // Handle task creation and updating
  const handleTaskSubmit = async (formData: TaskFormData, taskId?: number) => {
    setError(null);

    try {
      if (taskId) {
        // This is an update
        const updatedTask = await updateTask(taskId, formData);

        // Update the task in the list
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.task_id === taskId ? updatedTask : task
          )
        );

        // Clear editing state
        setEditingTask(null);
      } else {
        // This is a create
        const payload = {
          ...formData,
          student_id: studentId,
        };

        // Create the task using our service
        const newTask = await createTask(payload);

        // Add the new task to the list
        setTasks((prevTasks) => [newTask, ...prevTasks]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Task operation error:", err);
      throw err; // Re-throw to let the form component know there was an error
    }
  };

  // Handle marking a task as completed
  const handleCompleteTask = async (taskId: number) => {
    setError(null);

    try {
      // Update the task with completed_at timestamp
      const updatedTask = await updateTask(taskId, {
        completed_at: new Date().toISOString(),
      });

      // Update the task in the list
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.task_id === taskId ? updatedTask : task))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Complete task error:", err);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId: number) => {
    setError(null);

    try {
      // Call the API to delete the task
      await deleteTask(taskId);

      // Remove the task from the UI after successful deletion
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.task_id !== taskId)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Delete task error:", err);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">My Tasks</h1>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Edit/Create Task Form */}
      <EditTaskForm
        onSubmit={handleTaskSubmit}
        task={editingTask}
        onCancel={() => setEditingTask(null)}
      />

      {/* Task List */}
      <h2 className="text-xl font-semibold pt-4">Existing Tasks</h2>
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        studentId={studentId}
        onEdit={setEditingTask}
        onComplete={handleCompleteTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default TasksPage;
