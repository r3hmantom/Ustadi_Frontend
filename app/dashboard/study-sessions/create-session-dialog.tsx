import { useState, useEffect } from "react";
import { Plus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchTasks } from "@/app/services/taskService";
import { Task } from "@/db/types";
import { useUser } from "@/lib/hooks/useUser";
import { Loader } from "@/components/ui/loader";
import { LoadingButton } from "@/components/ui/loading-button";

interface CreateSessionDialogProps {
  loading: boolean;
  onCreateSession: (sessionData: {
    session_type: string;
    duration_minutes: number;
    task_id: number;
  }) => void;
}

export function CreateSessionDialog({
  loading,
  onCreateSession,
}: CreateSessionDialogProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    session_type: "Pomodoro",
    duration_minutes: 25,
    task_id: 0,
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  // Fetch tasks when dialog opens
  useEffect(() => {
    if (open && user?.studentId) {
      setTasksLoading(true);
      fetchTasks(user.studentId)
        .then((fetchedTasks) => {
          setTasks(fetchedTasks);
          // Set default task if available
          if (fetchedTasks.length > 0 && !newSession.task_id) {
            setNewSession((prev) => ({
              ...prev,
              task_id: fetchedTasks[0].task_id,
            }));
          }
        })
        .catch((err) => console.error("Failed to fetch tasks:", err))
        .finally(() => setTasksLoading(false));
    }
  }, [open, user?.studentId, newSession.task_id]); // Added newSession.task_id to dependency array

  const handleCreateSession = () => {
    onCreateSession(newSession);
    if (!loading) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Study Session</DialogTitle>
          <DialogDescription>
            Create a new study session to track your study time.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="session-type" className="text-right">
              Type
            </label>
            <Select
              value={newSession.session_type}
              onValueChange={(value) =>
                setNewSession({ ...newSession, session_type: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pomodoro">Pomodoro</SelectItem>
                <SelectItem value="Revision">Revision</SelectItem>
                <SelectItem value="Group Study">Group Study</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="task" className="text-right">
              Related Task
            </label>
            <Select
              value={newSession.task_id.toString()}
              onValueChange={(value) =>
                setNewSession({ ...newSession, task_id: parseInt(value) })
              }
              disabled={tasksLoading}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue
                  placeholder={
                    tasksLoading ? (
                      <div className="flex items-center">
                        <Loader size="small" className="mr-2" /> Loading tasks...
                      </div>
                    ) : (
                      "Select a task"
                    )
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((task) => (
                  <SelectItem
                    key={task.task_id}
                    value={task.task_id.toString()}
                  >
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="duration" className="text-right">
              Duration (min)
            </label>
            <Input
              id="duration"
              type="number"
              value={newSession.duration_minutes}
              onChange={(e) =>
                setNewSession({
                  ...newSession,
                  duration_minutes: Number(e.target.value),
                })
              }
              min={1}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <LoadingButton
            type="submit"
            onClick={handleCreateSession}
            isLoading={loading}
            disabled={!newSession.task_id}
            icon={<Play className="h-4 w-4" />}
          >
            Start Session
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
