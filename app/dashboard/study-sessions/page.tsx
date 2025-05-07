"use client";

import { useState, useEffect, useCallback } from "react"; // Added useCallback
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StudySession } from "@/db/types";
import {
  fetchStudySessions,
  createStudySession,
  deleteStudySession,
} from "@/app/services/studySessionService";
import { useUser } from "@/lib/hooks/useUser";
import { CreateSessionDialog } from "./create-session-dialog";
import { SessionsList } from "./sessions-list";
import { Loader } from "@/components/ui/loader";

export default function StudySessions() {
  const { user } = useUser();

  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load study sessions
  const loadStudySessions = useCallback(async () => {
    // Wrapped in useCallback
    try {
      setLoading(true);
      setError(null);

      if (!user?.studentId) {
        return;
      }

      const sessions = await fetchStudySessions(user.studentId);
      setStudySessions(sessions);
    } catch (err) {
      console.error("Failed to load study sessions", err);
      setError("Failed to load study sessions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user?.studentId]); // Added dependency for useCallback

  // Load study sessions when user data is available
  useEffect(() => {
    if (user?.studentId) {
      loadStudySessions();
    }
  }, [user?.studentId, loadStudySessions]); // Added loadStudySessions to dependency array

  // Handle new session creation
  const handleCreateSession = async (newSession: {
    session_type: string;
    duration_minutes: number;
    task_id: number;
  }) => {
    if (!user?.studentId) return;

    try {
      setLoading(true);

      const startTime = new Date();

      const payload = {
        student_id: user.studentId,
        session_type: newSession.session_type as
          | "Pomodoro"
          | "Revision"
          | "Group Study",
        start_time: startTime.toISOString(),
        duration_minutes: newSession.duration_minutes,
        task_id: newSession.task_id,
      };

      await createStudySession(payload);

      // Reload sessions to get the newly created one
      await loadStudySessions();
    } catch (err) {
      console.error("Failed to create study session", err);
      setError("Failed to create study session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle session update
  const handleUpdateSession = (updatedSession: StudySession) => {
    setStudySessions((prev) =>
      prev.map((session) =>
        session.session_id === updatedSession.session_id
          ? updatedSession
          : session
      )
    );
  };

  // Handle session deletion
  const handleDeleteSession = async (sessionId: number) => {
    if (!confirm("Are you sure you want to delete this study session?")) return;

    try {
      setLoading(true);
      await deleteStudySession(sessionId);

      // Remove the deleted session from state
      setStudySessions((prevSessions) =>
        prevSessions.filter((session) => session.session_id !== sessionId)
      );
    } catch (err) {
      console.error("Failed to delete study session", err);
      setError("Failed to delete study session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto pb-12 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Study Sessions</h1>
        <CreateSessionDialog
          loading={loading}
          onCreateSession={handleCreateSession}
        />
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!loading && studySessions.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Study Sessions</CardTitle>
            <CardDescription>
              You don&apos;t have any study sessions yet. Click &quot;New
              Session&quot; to get started.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <SessionsList
        studySessions={studySessions}
        loading={loading}
        onDelete={handleDeleteSession}
        onUpdate={handleUpdateSession}
      />
    </div>
  );
}
