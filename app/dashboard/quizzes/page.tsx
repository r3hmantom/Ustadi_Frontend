"use client";

import { useState } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { useQuiz } from "@/lib/hooks/useQuiz";
import { useAsyncAction } from "@/lib/hooks/useAsyncAction";
import { Plus, Pencil, Trash2, Eye, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { CreateQuizDialog } from "./create-quiz-dialog";

// Define a type for quizzes that may come from different sources
interface QuizWithMixedId {
  id?: number;
  quiz_id?: number;
  title: string;
  description: string | null;
  created_at: string | Date;
  is_public?: boolean;
}

const QuizzesPage = () => {
  const { user } = useUser();
  const { quizzes, isLoading, error, deleteQuiz, fetchQuizzes } = useQuiz();

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Use async action for deleting quizzes
  const {
    execute: handleDeleteQuiz,
    isLoading: isDeleting,
    error: deleteError,
  } = useAsyncAction(
    async (quizId: number) => {
      if (
        window.confirm(
          "Are you sure you want to delete this quiz? This action cannot be undone."
        )
      ) {
        await deleteQuiz(quizId);
      }
    },
    {
      successMessage: "Quiz deleted successfully",
      errorMessage: "Failed to delete quiz",
    }
  );

  // Helper function to get the ID from either property
  const getQuizId = (quiz: QuizWithMixedId): number | undefined => {
    return quiz.id !== undefined ? quiz.id : quiz.quiz_id;
  };

  const handleQuizCreated = () => {
    // After a quiz is created, refresh the list
    if (user?.studentId) {
      fetchQuizzes(user.studentId);
    }
    setShowCreateDialog(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-muted-foreground">Loading quizzes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Quizzes</h1>
          <p className="text-muted-foreground">
            Create and manage your quizzes
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Quiz
        </Button>
      </div>

      {deleteError && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      <CreateQuizDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        studentId={user?.studentId}
        onQuizCreated={handleQuizCreated}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-1">No quizzes yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first quiz to get started
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" /> New Quiz
            </Button>
          </div>
        ) : (
          quizzes.map((quiz, idx) => {
            // Cast the quiz to our mixed type for type safety
            const mixedQuiz = quiz as unknown as QuizWithMixedId;
            const quizId = getQuizId(mixedQuiz);

            return (
              <Card key={idx} className="p-4 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{mixedQuiz.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {mixedQuiz.description || "No description"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-xs text-muted-foreground mt-2 mb-4">
                  <span>
                    Created:{" "}
                    {new Date(mixedQuiz.created_at).toLocaleDateString()}
                  </span>
                  <span className="ml-4">
                    {mixedQuiz.is_public ? "Public" : "Private"}
                  </span>
                </div>

                <div className="mt-auto flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/quizzes/${quizId}`}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/quizzes/${quizId}/edit`}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => quizId && handleDeleteQuiz(quizId)}
                    disabled={isDeleting || !quizId}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default QuizzesPage;
