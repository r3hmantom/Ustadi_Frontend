import { format } from "date-fns";
import { Clock, Trash2, CheckCircle } from "lucide-react";
import { StudySession } from "@/db/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateStudySession } from "@/app/services/studySessionService";

interface SessionCardProps {
  session: StudySession;
  onDelete: () => void;
  onUpdate?: (updatedSession: StudySession) => void;
}

export function SessionCard({ session, onDelete, onUpdate }: SessionCardProps) {
  // Format time
  const formatTime = (date: Date) => {
    return format(new Date(date), "h:mm a");
  };

  // Format duration
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "N/A";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minutes`;
  };

  // Get session type badge color
  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "Pomodoro":
        return "bg-red-100 text-red-800";
      case "Revision":
        return "bg-blue-100 text-blue-800";
      case "Group Study":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle completing a session
  const handleCompleteSession = async () => {
    if (!confirm("Mark this session as complete?")) return;

    try {
      const now = new Date();
      const updatedSession = await updateStudySession(session.session_id, {
        end_time: now.toISOString(),
      });

      if (onUpdate) {
        onUpdate(updatedSession);
      }
    } catch (err) {
      console.error("Failed to complete study session", err);
      alert("Failed to complete study session. Please try again.");
    }
  };

  const isSessionCompleted = Boolean(session.end_time);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{session.session_type}</CardTitle>
            <CardDescription>
              {session.start_time && formatTime(new Date(session.start_time))}
              {session.end_time &&
                ` - ${formatTime(new Date(session.end_time))}`}
            </CardDescription>
          </div>
          <span
            className={`px-2 py-1 rounded-md text-xs font-semibold ${getSessionTypeColor(session.session_type)}`}
          >
            {session.session_type}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Duration: {formatDuration(session.duration_minutes)}</span>
        </div>
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">
            Linked to task #{session.task_id}
          </span>
        </div>
        {session.end_time && (
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <CheckCircle className="mr-1 h-3 w-3" />
            <span>Completed</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        {!isSessionCompleted && (
          <Button variant="outline" size="sm" onClick={handleCompleteSession}>
            <CheckCircle className="mr-1 h-4 w-4" />
            Complete
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className={isSessionCompleted ? "ml-auto" : ""}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
