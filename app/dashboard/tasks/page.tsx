"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TaskFormData } from "./edit-task-form";
import { AnimatedTaskList } from "./animated-task-list";
import { TaskDialog } from "./task-dialog";
import { TaskDetailView } from "./task-detail-view";
import useTask from "@/lib/hooks/useTask";
import { useUserStore } from "@/lib/stores/useUserStore";
import { completeTask } from "@/app/services/taskService";

const TasksPage = () => {
  // State from task store
  const {
    activeTasks,
    completedTasks,
    isLoading,
    error,
    selectedTask,
    createTask,
    updateTask,
    deleteTask,
    setSelectedTask,
    isOperationInProgress,
    fetchTasks,
  } = useTask();

  // Get current user for fetching tasks
  const { user } = useUserStore();
  const studentId = user?.studentId;

  // Local UI state
  const [editingTask, setEditingTask] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  // Handle opening the create task dialog
  const handleCreateTask = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  // Handle editing a task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
    setSelectedTask(null); // Close task detail view when editing
  };

  // Handle viewing task details
  const handleViewTaskDetails = (task) => {
    setSelectedTask(task);
  };

  // Handle closing task details
  const handleCloseTaskDetails = () => {
    setSelectedTask(null);
  };

  // Handle task creation and updating
  const handleTaskSubmit = async (formData: TaskFormData, taskId?: number) => {
    try {
      if (taskId) {
        // This is an update
        await updateTask(taskId, formData);
        toast.success("Task updated successfully!");
      } else {
        // This is a create
        await createTask(formData);
        toast.success("Task created successfully!");
      }
      setIsDialogOpen(false);
      
      // Refresh tasks data
      if (studentId) {
        await fetchTasks(studentId);
      }
    } catch (err) {
      console.error("Task operation error:", err);
      toast.error("Failed to save task");
    }
  };

  // Handle marking a task as completed
  const handleCompleteTask = async (taskId: number) => {
    try {
      // Use the completeTask service function that handles recurring tasks
      const result = await completeTask(taskId);
      
      // Show appropriate success message based on whether a new task was created
      if (result.next) {
        toast.success("Task completed! A new recurring task has been created.");
      } else {
        toast.success("Task marked as completed!");
      }
      
      // Refresh tasks data
      if (studentId) {
        await fetchTasks(studentId);
      }
      
      // If we're viewing task details of the completed task, close the details view
      if (selectedTask && selectedTask.task_id === taskId) {
        setSelectedTask(null);
      }
    } catch (err) {
      console.error("Complete task error:", err);
      toast.error("Failed to complete task");
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully!");
      
      // Refresh tasks data
      if (studentId) {
        await fetchTasks(studentId);
      }
    } catch (err) {
      console.error("Delete task error:", err);
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      {selectedTask ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handleCloseTaskDetails}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Back to task list
            </Button>
          </div>

          <TaskDetailView
            task={selectedTask}
            studentId={studentId}
            onEdit={handleEditTask}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            isProcessing={{
              editing: isOperationInProgress(selectedTask.task_id, "editing"),
              completing: isOperationInProgress(selectedTask.task_id, "completing"),
              deleting: isOperationInProgress(selectedTask.task_id, "deleting"),
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header with title and create task button */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Tasks</h1>
            <Button onClick={handleCreateTask} className="gap-2">
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </div>

          {/* Error alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Task tab navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="active">Active Tasks</TabsTrigger>
              <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
            </TabsList>

            {/* Active tasks */}
            <TabsContent value="active" className="space-y-4">
              <AnimatedTaskList
                tasks={activeTasks}
                isLoading={isLoading}
                onTaskClick={handleViewTaskDetails}
                onEdit={handleEditTask}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
                isProcessingTask={(taskId, operation) =>
                  isOperationInProgress(taskId, operation)
                }
                emptyMessage="No active tasks. Click 'Add Task' to create one."
              />
            </TabsContent>

            {/* Completed tasks */}
            <TabsContent value="completed" className="space-y-4">
              <AnimatedTaskList
                tasks={completedTasks}
                isLoading={isLoading}
                onTaskClick={handleViewTaskDetails}
                onEdit={handleEditTask}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
                isProcessingTask={(taskId, operation) =>
                  isOperationInProgress(taskId, operation)
                }
                emptyMessage="No completed tasks yet."
              />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Create/Edit Task Dialog */}
      <TaskDialog
        task={editingTask}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleTaskSubmit}
      />
    </div>
  );
};

export default TasksPage;
