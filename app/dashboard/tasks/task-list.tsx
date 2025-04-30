"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Task } from "@/app/services/taskService";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  studentId: number;
}

export const TaskList = ({ tasks, isLoading, studentId }: TaskListProps) => {
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
          {/* Add CardFooter for actions like complete, edit, delete later */}
        </Card>
      ))}
    </div>
  );
};
