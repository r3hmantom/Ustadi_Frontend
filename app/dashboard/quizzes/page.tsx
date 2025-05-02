"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { Plus, Pencil, Trash2, Eye, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchQuizzes, deleteQuiz } from "@/app/services/quizService";
import { Quiz } from "@/db/types";
import { toast } from "sonner";
import Link from "next/link";
import { CreateQuizDialog } from "./create-quiz-dialog";

const QuizzesPage = () => {
  const { user } = useUser();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Load quizzes created by the current user
  useEffect(() => {
    const loadQuizzes = async () => {
      if (!user?.studentId) return;

      setIsLoading(true);

      try {
        const data = await fetchQuizzes(user.studentId);
        setQuizzes(data);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizzes();
  }, [user?.studentId]);

  const handleDeleteQuiz = async (quizId: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this quiz? This action cannot be undone."
      )
    ) {
      try {
        await deleteQuiz(quizId);
        setQuizzes(quizzes.filter((quiz) => quiz.quiz_id !== quizId));
        toast.success("Quiz deleted successfully");
      } catch (error) {
        console.error("Failed to delete quiz:", error);
      }
    }
  };

  const handleQuizCreated = (newQuiz: Quiz) => {
    setQuizzes([newQuiz, ...quizzes]);
    setShowCreateDialog(false);
    toast.success("Quiz created successfully");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-muted-foreground">Loading quizzes...</div>
      </div>
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
          quizzes.map((quiz) => (
            <Card key={quiz.quiz_id} className="p-4 flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{quiz.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {quiz.description || "No description"}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-xs text-muted-foreground mt-2 mb-4">
                <span>
                  Created: {new Date(quiz.created_at).toLocaleDateString()}
                </span>
                <span className="ml-4">
                  {quiz.is_public ? "Public" : "Private"}
                </span>
              </div>

              <div className="mt-auto flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/quizzes/${quiz.quiz_id}`}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/quizzes/${quiz.quiz_id}/edit`}>
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteQuiz(quiz.quiz_id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default QuizzesPage;
