"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Task } from "@/db/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Check, Trash2, Loader2, Calendar, Star } from "lucide-react";

// Custom function to get color based on priority
export const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 5:
      return "bg-red-500";
    case 4:
      return "bg-orange-400";
    case 3:
      return "bg-amber-300";
    case 2:
      return "bg-blue-300";
    case 1:
      return "bg-green-300";
    default:
      return "bg-gray-300";
  }
};

// Function to get color value for border
const getPriorityBorderColor = (priority: number) => {
  switch (priority) {
    case 5:
      return "#ef4444"; // red-500
    case 4:
      return "#fb923c"; // orange-400
    case 3:
      return "#fcd34d"; // amber-300
    case 2:
      return "#93c5fd"; // blue-300
    case 1:
      return "#86efac"; // green-300
    default:
      return "#d1d5db"; // gray-300
  }
};

// Custom function to get text for priority
const getPriorityText = (priority: number) => {
  switch (priority) {
    case 5:
      return "Critical";
    case 4:
      return "High";
    case 3:
      return "Medium";
    case 2:
      return "Low";
    case 1:
      return "Trivial";
    default:
      return "Medium";
  }
};

// Define the type for the processing state
type OperationType = "deleting" | "editing" | "completing";
type TaskProcessingState = {
  [taskId: number]: {
    [operation in OperationType]?: boolean;
  };
};

interface AnimatedTaskListProps {
  tasks: Task[];
  isLoading: boolean;
  studentId: number | undefined;
  onEdit: (task: Task) => void;
  onComplete?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
  processingTaskIds?: TaskProcessingState;
  onViewDetails?: (task: Task) => void; // New prop for viewing task details
}

export const AnimatedTaskList = ({
  tasks,
  isLoading,
  studentId,
  onEdit,
  onComplete,
  onDelete,
  processingTaskIds = {},
  onViewDetails, // New prop
}: AnimatedTaskListProps) => {
  // Helper function to check if a task has a specific operation in progress
  const isTaskProcessing = (taskId: number, operation?: OperationType) => {
    const taskState = processingTaskIds[taskId];
    if (!taskState) return false;

    // If operation is specified, check only that operation
    if (operation) return !!taskState[operation];

    // Otherwise, check if any operation is in progress for this task
    return Object.values(taskState).some((isProcessing) => isProcessing);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading your tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12 bg-muted/30 rounded-lg border border-dashed"
      >
        <h3 className="font-medium text-lg mb-2">No tasks found</h3>
        <p className="text-muted-foreground mb-4">
          {studentId
            ? "You haven't created any tasks yet. Create your first task to get started!"
            : "No tasks available. Please sign in to see your tasks."}
        </p>
      </motion.div>
    );
  }

  // Sort tasks by priority (highest first) and completion status
  const sortedTasks = [...tasks].sort((a, b) => {
    // Completed tasks at the bottom
    if (a.completed_at && !b.completed_at) return 1;
    if (!a.completed_at && b.completed_at) return -1;

    // For incomplete tasks, sort by priority (highest first)
    if (!a.completed_at && !b.completed_at) {
      return (b.priority || 3) - (a.priority || 3);
    }

    // For completed tasks, sort by completion date (newest first)
    if (a.completed_at && b.completed_at) {
      return (
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      );
    }

    return 0;
  });

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {sortedTasks.map((task) => {
          const isCompleted = !!task.completed_at;

          return (
            <motion.div
              key={task.task_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              layout
              transition={{
                duration: 0.3,
                layout: { type: "spring", damping: 15 },
              }}
            >
              <Card
                className={`
                overflow-hidden transition-all 
                ${isCompleted ? "opacity-60" : ""}
                hover:shadow-md border-l-4
                ${onViewDetails ? "cursor-pointer" : ""}
              `}
                style={{
                  borderLeftColor: task.priority
                    ? getPriorityBorderColor(task.priority)
                    : "transparent",
                }}
                onClick={onViewDetails ? () => onViewDetails(task) : undefined}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle
                        className={`${isCompleted ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 flex-wrap">
                        <span className="flex items-center text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          Created:{" "}
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>

                        {task.due_date && (
                          <span className="flex items-center text-xs ml-2">
                            <Calendar className="h-3 w-3 mr-1" />
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}

                        {task.priority && (
                          <span
                            className={`flex items-center text-xs ml-2 px-1.5 py-0.5 rounded ${getPriorityColor(task.priority)} text-black text-xs`}
                          >
                            <Star className="h-3 w-3 mr-1" />
                            {getPriorityText(task.priority)}
                          </span>
                        )}

                        {task.is_recurring && (
                          <span className="text-xs ml-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-1.5 py-0.5 rounded">
                            Recurring
                          </span>
                        )}

                        {task.completed_at && (
                          <span className="text-xs ml-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-1.5 py-0.5 rounded">
                            Completed:{" "}
                            {new Date(task.completed_at).toLocaleDateString()}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                {task.description && (
                  <CardContent>
                    <p
                      className={`${isCompleted ? "text-muted-foreground" : ""}`}
                    >
                      {task.description}
                    </p>
                  </CardContent>
                )}

                <CardFooter className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(task)}
                    disabled={
                      isTaskProcessing(task.task_id, "editing") || isCompleted
                    }
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>

                  {onComplete && !task.completed_at && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onComplete(task.task_id)}
                      disabled={isTaskProcessing(task.task_id, "completing")}
                    >
                      {isTaskProcessing(task.task_id, "completing") ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Check className="h-3 w-3 mr-1" />
                      )}
                      Complete
                    </Button>
                  )}

                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(task.task_id)}
                      disabled={isTaskProcessing(task.task_id, "deleting")}
                    >
                      {isTaskProcessing(task.task_id, "deleting") ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3 mr-1" />
                      )}
                      Delete
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
