"use client";
import { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Task } from "@/db/types";

// Type for the form data which represents a new task or task update
export interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: number;
  is_recurring: boolean;
  recurrence_pattern?: string;
}

interface EditTaskFormProps {
  onSubmit: (formData: TaskFormData, taskId?: number) => Promise<void>;
  onCancel?: () => void;
  task: Task | null;
}

// Recurrence pattern options
export const RECURRENCE_PATTERNS = {
  DAILY: "daily",
  WEEKLY: "weekly",
  BIWEEKLY: "biweekly",
  MONTHLY: "monthly",
  CUSTOM: "custom",
};

export const EditTaskForm = ({
  onSubmit,
  onCancel,
  task,
}: EditTaskFormProps) => {
  const isEditMode = !!task;

  const [formState, setFormState] = useState<TaskFormData>({
    title: "",
    description: "",
    due_date: "",
    priority: 3, // Default priority
    is_recurring: false,
    recurrence_pattern: RECURRENCE_PATTERNS.WEEKLY, // Default recurrence pattern
  });

  // When the task prop changes, update the form state
  useEffect(() => {
    if (task) {
      setFormState({
        title: task.title,
        description: task.description || "",
        due_date: task.due_date
          ? new Date(task.due_date).toISOString().split("T")[0]
          : "", // Convert to YYYY-MM-DD
        priority: task.priority || 3,
        is_recurring: Boolean(task.is_recurring),
        recurrence_pattern: task.recurrence_pattern || RECURRENCE_PATTERNS.WEEKLY,
      });
    }
  }, [task]);

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

  const handleRecurrencePatternChange = (value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      recurrence_pattern: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formState.title) {
      return; // Don't submit if title is empty
    }

    // If not recurring, remove the pattern before submitting
    const dataToSubmit = { ...formState };
    if (!dataToSubmit.is_recurring) {
      delete dataToSubmit.recurrence_pattern;
    }

    try {
      await onSubmit(dataToSubmit, task?.task_id);

      if (!isEditMode) {
        // Reset form after successful submission only if creating a new task
        setFormState({
          title: "",
          description: "",
          due_date: "",
          priority: 3,
          is_recurring: false,
          recurrence_pattern: RECURRENCE_PATTERNS.WEEKLY,
        });
      }
    } catch (error) {
      // Error handling is done by the parent component
      console.error("Error in form submission:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Task" : "Create New Task"}</CardTitle>
        <CardDescription>
          {isEditMode ? "Update task details." : "Add a new task to your list."}
        </CardDescription>
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
          
          {formState.is_recurring && (
            <div className="space-y-2">
              <Label htmlFor="recurrence_pattern">Recurrence Pattern</Label>
              <Select
                value={formState.recurrence_pattern}
                onValueChange={handleRecurrencePatternChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a recurrence pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Recurrence</SelectLabel>
                    <SelectItem value={RECURRENCE_PATTERNS.DAILY}>Daily</SelectItem>
                    <SelectItem value={RECURRENCE_PATTERNS.WEEKLY}>Weekly</SelectItem>
                    <SelectItem value={RECURRENCE_PATTERNS.BIWEEKLY}>Bi-weekly</SelectItem>
                    <SelectItem value={RECURRENCE_PATTERNS.MONTHLY}>Monthly</SelectItem>
                    <SelectItem value={RECURRENCE_PATTERNS.CUSTOM}>Custom</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditMode && onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {isEditMode ? "Update Task" : "Add Task"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
