"use client";

import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2, X, Save } from "lucide-react";
import { TaskFormData } from "./edit-task-form";
import { Task } from "@/db/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "@/components/ui/loader";
import { LoadingButton } from "@/components/ui/loading-button";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: TaskFormData, taskId?: number) => Promise<void>;
  task: Task | null;
}

export function TaskDialog({
  open,
  onOpenChange,
  onSubmit,
  task,
}: TaskDialogProps) {
  const isEditMode = !!task;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState<TaskFormData>({
    title: "",
    description: "",
    due_date: "",
    priority: 3,
    is_recurring: false,
  });

  // When the task prop changes, update the form state
  useEffect(() => {
    if (task) {
      setFormState({
        title: task.title,
        description: task.description || "",
        due_date: task.due_date
          ? new Date(task.due_date).toISOString().split("T")[0]
          : "",
        priority: task.priority || 3,
        is_recurring: Boolean(task.is_recurring),
      });
    } else {
      // Reset form when opening for a new task
      setFormState({
        title: "",
        description: "",
        due_date: "",
        priority: 3,
        is_recurring: false,
      });
    }
  }, [task]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormState((prevState) => ({
      ...prevState,
      [name]:
        type === "number" && value !== "" ? parseInt(value, 10) : newValue,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formState.title) {
      toast.error("Task title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formState, task?.task_id);
      toast.success(
        isEditMode ? "Task updated successfully!" : "Task created successfully!"
      );
      onOpenChange(false);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-card text-card-foreground w-full max-w-md rounded-xl border shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                {isEditMode ? "Edit Task" : "Create New Task"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Complete Math Homework"
                  disabled={isSubmitting}
                  required
                  className="focus:ring-primary"
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
                  disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
                <Label htmlFor="is_recurring" className="cursor-pointer">
                  Recurring task
                </Label>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <LoadingButton 
                  type="submit" 
                  isLoading={isSubmitting}
                  loadingText={isEditMode ? "Updating..." : "Creating..."}
                  icon={<Save className="h-4 w-4" />}
                >
                  {isEditMode ? "Update Task" : "Create Task"}
                </LoadingButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
