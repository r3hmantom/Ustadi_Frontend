"use client";

import { useState } from "react";
import { useTask } from "@/lib/hooks/useTask";
import { useAsyncAction } from "@/lib/hooks/useAsyncAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, AlertCircle, Trash } from "lucide-react";

export default function TaskListExample() {
  const {
    activeTasks,
    isLoading,
    error,
    updateTask,
    deleteTask,
    isOperationInProgress,
  } = useTask();

  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Use async action for completing tasks
  const {
    execute: completeTask,
    isLoading: isCompletingTask,
    error: completeError,
  } = useAsyncAction(
    async (taskId: number) => {
      await updateTask(taskId, {
        completed_at: new Date().toISOString(),
      });
    },
    {
      successMessage: "Task marked as completed!",
      errorMessage: "Failed to complete task",
    }
  );

  // Use async action for deleting tasks
  const {
    execute: removeTask,
    isLoading: isDeletingTask,
    error: deleteError,
  } = useAsyncAction(
    async (taskId: number) => {
      await deleteTask(taskId);
    },
    {
      successMessage: "Task deleted successfully!",
      errorMessage: "Failed to delete task",
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-4">
              <Skeleton className="h-5 w-2/3" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-end mt-4 space-x-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (activeTasks.length === 0) {
    return (
      <Alert>
        <AlertTitle>No tasks</AlertTitle>
        <AlertDescription>You don't have any active tasks.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {completeError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{completeError}</AlertDescription>
        </Alert>
      )}

      {deleteError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      {activeTasks.map((task) => (
        <Card key={task.id} className="overflow-hidden">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">{task.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground mb-4">
              {task.description}
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => completeTask(task.id)}
                disabled={
                  isOperationInProgress(task.id, "completing") ||
                  isCompletingTask
                }
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeTask(task.id)}
                disabled={
                  isOperationInProgress(task.id, "deleting") || isDeletingTask
                }
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
