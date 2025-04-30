"use client"; // Required for hooks like useState, useEffect

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription, // Added for better context
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error display

// Define the Task type matching the backend interface
interface Task {
  task_id: number;
  student_id: number;
  title: string;
  description: string | null;
  due_date: string | null; // Use string for date input compatibility
  priority: number | null;
  recurrence_pattern: string | null;
  parent_task_id: number | null;
  created_at: string; // Dates are often strings when fetched
  completed_at: string | null;
  is_recurring: boolean;
}

// Define the shape for the new task form data
interface NewTaskForm {
  title: string;
  description: string;
  due_date: string;
  priority: number;
  is_recurring: boolean;
  // Add other fields like recurrence_pattern, parent_task_id if needed
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<NewTaskForm>({
    title: "",
    description: "",
    due_date: "",
    priority: 3, // Default priority
    is_recurring: false,
  });

  // --- Hardcoded student_id for now ---
  // In a real app, get this from auth context or session
  const studentId = 1;
  // --- ---

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Construct URL with student_id query parameter
        const response = await fetch(`/api/tasks?student_id=${studentId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData?.error?.message ||
              `Failed to fetch tasks: ${response.statusText}`
          );
        }
        const result = await response.json();
        if (result.success) {
          setTasks(result.data);
        } else {
          throw new Error(result.error?.message || "Failed to fetch tasks");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Fetch tasks error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [studentId]); // Re-fetch if studentId changes

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    // Handle checkbox separately
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormState((prevState) => ({
      ...prevState,
      [name]:
        type === "number" && value !== "" ? parseInt(value, 10) : newValue,
    }));
  };

  // Handle form submission to create a new task
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formState.title) {
      setError("Task title is required.");
      return;
    }

    const payload = {
      ...formState,
      student_id: studentId, // Add the student ID
      due_date: formState.due_date || null, // Send null if empty
      description: formState.description || null, // Send null if empty
      priority: formState.priority || null,
    };

    try {
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
          result.error?.message ||
            `Failed to create task: ${response.statusText}`
        );
      }

      // Add the new task to the list and reset form
      setTasks((prevTasks) => [result.data, ...prevTasks]);
      setFormState({
        // Reset form
        title: "",
        description: "",
        due_date: "",
        priority: 3,
        is_recurring: false,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Create task error:", err);
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
      <Card>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
          <CardDescription>Add a new task to your list.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formState.title}
                onChange={handleInputChange}
                placeholder="e.g., Complete Math Homework"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              {/* Using Input for now, replace with Textarea if available/preferred */}
              <Input
                id="description"
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                placeholder="Optional details about the task"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  name="due_date"
                  type="date"
                  value={formState.due_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority (1-5)</Label>
                <Input
                  id="priority"
                  name="priority"
                  type="number"
                  min="1"
                  max="5"
                  value={formState.priority}
                  onChange={handleInputChange}
                  placeholder="e.g., 3"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="is_recurring"
                name="is_recurring"
                checked={formState.is_recurring}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({
                    ...prev,
                    is_recurring: Boolean(checked),
                  }))
                }
              />
              <Label htmlFor="is_recurring">Is Recurring?</Label>
            </div>
            {/* Add inputs for recurrence_pattern, parent_task_id if needed */}
          </CardContent>
          <CardFooter>
            <Button type="submit">Add Task</Button>
          </CardFooter>
        </form>
      </Card>

      {/* Task List */}
      <h2 className="text-xl font-semibold pt-4">Existing Tasks</h2>
      {isLoading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found for student ID {studentId}.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.task_id}>
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>
                  Created: {new Date(task.created_at).toLocaleDateString()}
                  {task.due_date &&
                    ` | Due: ${new Date(task.due_date).toLocaleDateString()}`}
                  {task.priority && ` | Priority: ${task.priority}`}
                  {task.is_recurring && ` | Recurring`}
                </CardDescription>
              </CardHeader>
              {task.description && (
                <CardContent>
                  <p>{task.description}</p>
                </CardContent>
              )}
              {/* Add CardFooter for actions like complete, edit, delete later */}
              {/* Example:
                            <CardFooter className="flex justify-end space-x-2">
                                <Button variant="outline" size="sm">Mark Complete</Button>
                                <Button variant="secondary" size="sm">Edit</Button>
                                <Button variant="destructive" size="sm">Delete</Button>
                            </CardFooter>
                            */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
