"use client";

import { useState, useEffect, use } from "react";
import { useUser } from "@/lib/hooks/useUser";
import {
  ArrowLeft,
  ClipboardList,
  AlertTriangle,
  PlayIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { fetchQuiz } from "@/app/services/quizService";
import { QuizWithQuestions } from "@/app/services/quizService";
import { Question } from "@/db/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface QuizDetailPageProps {
  params: {
    id: string;
  };
}

export default function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = use(params);
  const quizId = parseInt(id, 10);
  const { user } = useUser();
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!quizId || isNaN(quizId)) {
        setError("Invalid quiz ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const quizData = await fetchQuiz(quizId);
        setQuiz(quizData);
        setIsLoading(false);
      } catch (e) {
        console.error("Failed to load quiz:", e);
        setError("Failed to load quiz details");
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  // Check if quiz belongs to current user
  useEffect(() => {
    if (quiz && user && quiz.student_id !== user.studentId) {
      // Check if quiz is public before redirecting
      if (!quiz.is_public) {
        router.push("/dashboard/quizzes");
      }
    }
  }, [quiz, user, router]);

  const renderQuestion = (question: Question, index: number) => {
    return (
      <Card key={question.question_id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="font-medium">
              Question {index + 1}
              <Badge variant="secondary" className="ml-2">
                MCQ
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="font-medium mb-1">Question:</div>
            <div className="text-muted-foreground">{question.content}</div>
          </div>

          <div className="space-y-2">
            <div className="font-medium mb-1">Answer Options:</div>
            <div className="grid gap-2">
              {[
                { key: "a", label: "A", value: question.option_a },
                { key: "b", label: "B", value: question.option_b },
                { key: "c", label: "C", value: question.option_c },
                { key: "d", label: "D", value: question.option_d },
              ].map((option) => (
                <div
                  key={option.key}
                  className={`p-2 rounded-md ${
                    option.key === question.correct_answer
                      ? "bg-green-100 dark:bg-green-900/20 border-l-4 border-green-500"
                      : "bg-muted/40"
                  }`}
                >
                  <span className="font-medium mr-2">{option.label}.</span>
                  {option.value}
                  {option.key === question.correct_answer && (
                    <span className="text-green-600 dark:text-green-400 text-sm ml-2">
                      (Correct Answer)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-muted-foreground">Loading quiz details...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="sm" asChild className="mb-6">
            <Link href="/dashboard/quizzes">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Quizzes
            </Link>
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
          <h3 className="text-xl font-medium mb-1">Quiz Not Found</h3>
          <p className="text-muted-foreground mb-4">
            {error ||
              "The quiz you're looking for doesn't exist or you don't have permission to view it."}
          </p>
          <Button asChild>
            <Link href="/dashboard/quizzes">View All Quizzes</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Check if this quiz has questions and can be attempted
  const canAttemptQuiz = quiz.questions.length > 0;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/quizzes">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Quizzes
          </Link>
        </Button>

        <div className="space-x-2">
          {user && quiz.student_id === user.studentId && (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/dashboard/quizzes/${quiz.quiz_id}/edit`}>
                Edit Quiz
              </Link>
            </Button>
          )}

          {user && canAttemptQuiz && (
            <Button size="sm" asChild>
              <Link href={`/dashboard/quizzes/${quiz.quiz_id}/attempt`}>
                <PlayIcon className="h-4 w-4 mr-2" /> Attempt Quiz
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        {quiz.description && (
          <p className="text-muted-foreground mb-2">{quiz.description}</p>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Created: {new Date(quiz.created_at).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span>{quiz.is_public ? "Public" : "Private"}</span>
          <span className="mx-2">•</span>
          <span>
            {quiz.questions.length} question
            {quiz.questions.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {user && canAttemptQuiz && (
        <Card className="mb-6 bg-primary/5">
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <h3 className="font-medium text-lg">
                Ready to test your knowledge?
              </h3>
              <p className="text-muted-foreground">
                This quiz has {quiz.questions.length} multiple choice question
                {quiz.questions.length !== 1 ? "s" : ""}.
              </p>
            </div>
            <Button asChild>
              <Link href={`/dashboard/quizzes/${quiz.quiz_id}/attempt`}>
                <PlayIcon className="h-4 w-4 mr-2" /> Start Quiz
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Separator className="my-6" />

      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <ClipboardList className="h-5 w-5 mr-2" />
          Questions ({quiz.questions.length})
        </h2>

        {quiz.questions.length === 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">
              No questions have been added to this quiz yet.
            </p>
            {user && quiz.student_id === user.studentId && (
              <Button className="mt-4" asChild>
                <Link href={`/dashboard/quizzes/${quiz.quiz_id}/edit`}>
                  Add Questions
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <div key={question.question_id || index}>
                {renderQuestion(question, index)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
