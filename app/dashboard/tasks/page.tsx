"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchTasks, createTask } from "@/app/services/taskService";
import { TaskUI, NewTaskForm } from "@/lib/types";
import { CreateTaskForm } from "./create-task-form";
import { TaskList } from "./task-list";

const TasksPage = () => {
  const [tasks, setTasks] = useState<TaskUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Hardcoded student_id for now ---
  // In a real app, get this from auth context or session
  const studentId = 1;
  // --- ---

  // Fetch tasks on component mount
  useEffect(() => {
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

    loadTasks();
  }, [studentId]); // Re-fetch if studentId changes

  // Handle task creation
  const handleCreateTask = async (formData: NewTaskForm) => {
    setError(null);

    try {
      // Add student_id to the payload
      const payload = {
        ...formData,
        student_id: studentId,
      };

      // Create the task using our service
      const newTask = await createTask(payload);

      // Add the new task to the list
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Create task error:", err);
      throw err; // Re-throw to let the form component know there was an error
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

      {/* Create Task Form */}
      <CreateTaskForm onSubmit={handleCreateTask} />

      {/* Task List */}
      <h2 className="text-xl font-semibold pt-4">Existing Tasks</h2>
      <TaskList tasks={tasks} isLoading={isLoading} studentId={studentId} />
    </div>
  );
};

export default TasksPage;
