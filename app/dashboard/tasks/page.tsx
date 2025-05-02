"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/app/services/taskService";
import { TaskFormData } from "./edit-task-form";
import { AnimatedTaskList } from "./animated-task-list";
import { TaskDialog } from "./task-dialog";
import useUser from "@/lib/hooks/useUser";
import { Task } from "@/db/types";

const TasksPage = () => {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  // Replace simple Set with an object that tracks operation types
  type OperationType = "deleting" | "editing" | "completing";
  type TaskProcessingState = {
    [taskId: number]: {
      [operation in OperationType]?: boolean;
    };
  };

  const [taskProcessingState, setTaskProcessingState] =
    useState<TaskProcessingState>({});

  // Get current user context
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
  }, [loadTasks]);

  // Handle opening the create task dialog
  const handleCreateTask = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  // Handle editing a task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

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
      } else {
        // This is a create
        const payload = {
          ...formData,
          student_id: studentId,
        };

        // Create the task
        const newTask = await createTask(payload);

        // Add the new task to the list
        setTasks((prevTasks) => [newTask, ...prevTasks]);
      }

      toast.success("Task saved successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Task operation error:", err);
      throw err;
    }
  };

  // Handle marking a task as completed
  const handleCompleteTask = async (taskId: number) => {
    setError(null);
    // Add to processing tasks
    setTaskProcessingState((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], completing: true },
    }));

    try {
      // Update the task with completed_at timestamp
      const updatedTask = await updateTask(taskId, {
        completed_at: new Date().toISOString(),
      });

      // Update the task in the list
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.task_id === taskId ? updatedTask : task))
      );

      toast.success("Task marked as completed!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Complete task error:", err);
      toast.error("Failed to complete task");
    } finally {
      // Remove from processing tasks
      setTaskProcessingState((prev) => {
        const { [taskId]: taskState, ...rest } = prev;
        return {
          ...rest,
          [taskId]: { ...taskState, completing: false },
        };
      });
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId: number) => {
    setError(null);
    // Add to processing tasks
    setTaskProcessingState((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], deleting: true },
    }));

    try {
      // Call the API to delete the task
      await deleteTask(taskId);

      // Remove the task from the UI after successful deletion
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.task_id !== taskId)
      );

      toast.success("Task deleted successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Delete task error:", err);
      toast.error("Failed to delete task");
    } finally {
      // Remove from processing tasks
      setTaskProcessingState((prev) => {
        const { [taskId]: taskState, ...rest } = prev;
        return {
          ...rest,
          [taskId]: { ...taskState, deleting: false },
        };
      });
    }
  };

  // Filter tasks based on active tab
  const activeTasks = tasks.filter((task) => !task.completed_at);
  const completedTasks = tasks.filter((task) => !!task.completed_at);

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold"
        >
          My Tasks
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={handleCreateTask} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </motion.div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Task Tabs */}
      <Tabs
        defaultValue="active"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full mb-6">
          <TabsTrigger value="active" className="flex-1">
            Active Tasks
            {activeTasks.length > 0 && (
              <span className="ml-2 text-xs py-0.5 px-2 rounded-full bg-primary/20">
                {activeTasks.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            Completed Tasks
            {completedTasks.length > 0 && (
              <span className="ml-2 text-xs py-0.5 px-2 rounded-full bg-primary/20">
                {completedTasks.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-2">
          <AnimatedTaskList
            tasks={activeTasks}
            isLoading={isLoading}
            studentId={studentId}
            onEdit={handleEditTask}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            processingTaskIds={taskProcessingState}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-2">
          <AnimatedTaskList
            tasks={completedTasks}
            isLoading={isLoading}
            studentId={studentId}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            processingTaskIds={taskProcessingState}
          />
        </TabsContent>
      </Tabs>

      {/* Task Dialog for Create/Edit */}
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleTaskSubmit}
        task={editingTask}
      />
    </div>
  );
};

export default TasksPage;
