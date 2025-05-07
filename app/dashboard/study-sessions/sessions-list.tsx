import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { StudySession } from "@/db/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionCard } from "./session-card";
import { Loader } from "@/components/ui/loader";

interface GroupedSessions {
  date: string;
  formattedDate: string;
  sessions: StudySession[];
}

interface SessionsListProps {
  studySessions: StudySession[];
  loading: boolean;
  onDelete: (sessionId: number) => void;
  onUpdate?: (updatedSession: StudySession) => void;
}

export function SessionsList({
  studySessions,
  loading,
  onDelete,
  onUpdate,
}: SessionsListProps) {
  // Group sessions by date for better organization
  const groupSessionsByDate = (): GroupedSessions[] => {
    const groups: Record<string, StudySession[]> = {};

    studySessions.forEach((session) => {
      const date = format(new Date(session.start_time), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(session);
    });

    return Object.entries(groups).map(([date, sessions]) => ({
      date,
      formattedDate: format(new Date(date), "EEEE, MMMM d, yyyy"),
      sessions,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader size="small" text="Loading sessions..." />
      </div>
    );
  }

  if (studySessions.length === 0) {
    return null;
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">All Sessions</TabsTrigger>
        <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
        <TabsTrigger value="revision">Revision</TabsTrigger>
        <TabsTrigger value="group">Group Study</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-6 space-y-6">
        {groupSessionsByDate().map((group) => (
          <div key={group.date} className="space-y-3">
            <h3 className="font-medium flex items-center text-muted-foreground">
              <CalendarDays className="mr-2 h-4 w-4" />
              {group.formattedDate}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.sessions.map((session) => (
                <SessionCard
                  key={session.session_id}
                  session={session}
                  onDelete={() => onDelete(session.session_id)}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="pomodoro" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studySessions
            .filter((session) => session.session_type === "Pomodoro")
            .map((session) => (
              <SessionCard
                key={session.session_id}
                session={session}
                onDelete={() => onDelete(session.session_id)}
                onUpdate={onUpdate}
              />
            ))}
        </div>
      </TabsContent>

      <TabsContent value="revision" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studySessions
            .filter((session) => session.session_type === "Revision")
            .map((session) => (
              <SessionCard
                key={session.session_id}
                session={session}
                onDelete={() => onDelete(session.session_id)}
                onUpdate={onUpdate}
              />
            ))}
        </div>
      </TabsContent>

      <TabsContent value="group" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studySessions
            .filter((session) => session.session_type === "Group Study")
            .map((session) => (
              <SessionCard
                key={session.session_id}
                session={session}
                onDelete={() => onDelete(session.session_id)}
                onUpdate={onUpdate}
              />
            ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
