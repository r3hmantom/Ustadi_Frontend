"use client";
import { useState, FormEvent } from "react";
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
import { TaskFormData, RECURRENCE_PATTERNS } from "./edit-task-form";

interface CreateTaskFormProps {
  onSubmit: (formData: TaskFormData) => Promise<void>;
}

export const CreateTaskForm = ({ onSubmit }: CreateTaskFormProps) => {
  const [formState, setFormState] = useState<TaskFormData>({
    title: "",
    description: "",
    due_date: "",
    priority: 3, // Default priority
    is_recurring: false,
    recurrence_pattern: RECURRENCE_PATTERNS.WEEKLY, // Default recurrence pattern
  });

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
      await onSubmit(dataToSubmit);

      // Reset form after successful submission
      setFormState({
        title: "",
        description: "",
        due_date: "",
        priority: 3,
        is_recurring: false,
        recurrence_pattern: RECURRENCE_PATTERNS.WEEKLY,
      });
    } catch (error) {
      // Error handling is done by the parent component
      console.error("Error in form submission:", error);
    }
  };

  return (
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
        <CardFooter>
          <Button type="submit">Add Task</Button>
        </CardFooter>
      </form>
    </Card>
  );
};
