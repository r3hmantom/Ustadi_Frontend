"use client";

import {
  Calendar,
  Clock,
  Star,
  CheckCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { Task } from "@/db/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getPriorityColor } from "./animated-task-list";
import { TaskComments } from "./task-comments";

interface TaskDetailViewProps {
  task: Task;
  studentId: number | undefined;
  onEdit?: (task: Task) => void;
  onComplete?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
  isProcessing?: {
    editing?: boolean;
    completing?: boolean;
    deleting?: boolean;
  };
}

export const TaskDetailView = ({
  task,
  studentId,
  onEdit,
  onComplete,
  onDelete,
  isProcessing = {},
}: TaskDetailViewProps) => {
  const priorityColor = getPriorityColor(task.priority);
  const isCompleted = !!task.completed_at;

  return (
    <Card className="w-full">
      {/* Task Header */}
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${priorityColor}`}
              title={`Priority: ${task.priority}`}
            />
            <CardTitle
              className={
                isCompleted ? "line-through text-muted-foreground" : ""
              }
            >
              {task.title}
            </CardTitle>
          </div>
          {isCompleted && (
            <span className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 py-1 px-2 rounded-full">
              Completed
            </span>
          )}
        </div>
        <CardDescription className="space-y-1 mt-2">
          <div className="flex items-center text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              Created: {format(new Date(task.created_at), "MMM d, yyyy")}
            </span>
          </div>

          {task.due_date && (
            <div className="flex items-center text-xs">
              <Clock className="h-3 w-3 mr-1" />
              <span>Due: {format(new Date(task.due_date), "MMM d, yyyy")}</span>
            </div>
          )}

          {task.is_recurring && (
            <div className="flex items-center text-xs">
              <Star className="h-3 w-3 mr-1" />
              <span>Recurring Task</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>

      {/* Task Content */}
      {task.description && (
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{task.description}</p>
        </CardContent>
      )}

      {/* Task Actions */}
      <CardFooter className="flex justify-end space-x-2 border-t pt-4">
        {onEdit && !isCompleted && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)}
            disabled={isProcessing.editing}
          >
            <Edit2 className="h-3 w-3 mr-1" />
            Edit
          </Button>
        )}

        {onComplete && !isCompleted && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onComplete(task.task_id)}
            disabled={isProcessing.completing}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Complete
          </Button>
        )}

        {onDelete && !isCompleted && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(task.task_id)}
            disabled={isProcessing.deleting}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        )}
      </CardFooter>

      {/* Comments Section */}
      <div className="px-6 pb-6">
        <Separator className="my-4" />
        <TaskComments taskId={task.task_id} studentId={studentId} />
      </div>
    </Card>
  );
};
