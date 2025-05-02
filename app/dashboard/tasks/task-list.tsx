"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from "@/app/services/taskService";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  studentId: number;
  onEdit: (task: Task) => void;
  onComplete?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
}

export const TaskList = ({
  tasks,
  isLoading,
  studentId,
  onEdit,
  onComplete,
  onDelete,
}: TaskListProps) => {
  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (tasks.length === 0) {
    return <p>No tasks found for student ID {studentId}.</p>;
  }

  return (
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
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
              Edit
            </Button>
            {onComplete && !task.completed_at && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onComplete(task.task_id)}
              >
                Complete
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(task.task_id)}
              >
                Delete
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
