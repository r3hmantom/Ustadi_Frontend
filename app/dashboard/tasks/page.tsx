"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  UpdateTaskPayload,
} from "@/app/services/taskService";
import { TaskUI, NewTaskForm } from "@/lib/types";
import { EditTaskForm } from "./edit-task-form";
import { TaskList } from "./task-list";

const TasksPage = () => {
  const [tasks, setTasks] = useState<TaskUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<TaskUI | null>(null);

  // --- Hardcoded student_id for now ---
  // In a real app, get this from auth context or session
  const studentId = 1;
  // --- ---

  // Fetch tasks on component mount
  useEffect(() => {
    loadTasks();
  }, [studentId]); // Re-fetch if studentId changes

  const loadTasks = async () => {
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
  };

  // Handle task creation and updating
  const handleTaskSubmit = async (formData: NewTaskForm, taskId?: number) => {
    setError(null);

    try {
      if (taskId) {
        // This is an update
        const updatedTask = await updateTask(
          taskId,
          formData as UpdateTaskPayload
        );

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
