"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/lib/hooks/useUser";
import { fetchQuizAttemptDetails } from "@/app/services/quizService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { ArrowLeftIcon, CheckCircle2Icon, XCircleIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";

export default function QuizResultsPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = parseInt(params.id as string, 10);
  const attemptId = parseInt(params.attemptId as string, 10);
  const { user } = useUser();
  
  const [loading, setLoading] = useState(true);
  const [attemptData, setAttemptData] = useState<any>(null);

  useEffect(() => {
    const fetchAttemptData = async () => {
      if (isNaN(quizId) || isNaN(attemptId)) {
        toast.error("Invalid quiz or attempt ID");
        router.push("/dashboard/quizzes");
        return;
      }

      try {
        const data = await fetchQuizAttemptDetails(attemptId);
        setAttemptData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch quiz attempt:", error);
        toast.error("Failed to load quiz results");
        router.push("/dashboard/quizzes");
      }
    };

    fetchAttemptData();
  }, [quizId, attemptId, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2Icon className="h-8 w-8 animate-spin mb-4" />
        <p>Loading quiz results...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto my-8">
        <AlertDescription>
          You must be logged in to view quiz results.
        </AlertDescription>
      </Alert>
    );
  }

  if (!attemptData?.attempt || !attemptData?.questions || !attemptData?.answers) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto my-8">
        <AlertDescription>
          This quiz attempt could not be found.
        </AlertDescription>
      </Alert>
    );
  }

  const { attempt, questions, answers } = attemptData;
  const score = attempt.score || 0;
  const totalQuestions = attempt.total_questions;
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Map question ID to answer for easier lookup
  const answerMap = answers.reduce((acc: Record<number, any>, answer: any) => {
    acc[answer.question_id] = answer;
    return acc;
  }, {});

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Quiz Results</h1>
          <p className="text-muted-foreground mt-1">
            Completed on {formatDate(attempt.end_time)}
          </p>
        </div>
        <Link href={`/dashboard/quizzes/${quizId}`} passHref>
          <Button variant="outline">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Quiz
          </Button>
        </Link>
      </div>

      <Separator />
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Quiz Summary</span>
              <span className="text-lg">
                Score: {score}/{totalQuestions} ({percentage}%)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full ${percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-3">
          <h2 className="text-xl font-semibold mt-4">Question Review</h2>
          
          {questions.map((question: any, index: number) => {
            const answer = answerMap[question.question_id];
            const isCorrect = answer?.is_correct;
            
            return (
              <Card key={question.question_id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    {isCorrect ? (
                      <span className="flex items-center text-green-500">
                        <CheckCircle2Icon className="h-5 w-5 mr-1" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        <XCircleIcon className="h-5 w-5 mr-1" /> Incorrect
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-6 space-y-4">
                  <p className="font-medium">{question.content}</p>
                  
                  <div className="space-y-2">
                    {[
                      { key: "a", label: "A", value: question.option_a },
                      { key: "b", label: "B", value: question.option_b },
                      { key: "c", label: "C", value: question.option_c },
                      { key: "d", label: "D", value: question.option_d },
                    ].map((option) => (
                      <div key={option.key} className={`p-3 rounded-md flex items-center gap-2 ${
                        option.key === question.correct_answer ? 'bg-green-100 dark:bg-green-900/20' : 
                        option.key === answer?.selected_option && option.key !== question.correct_answer ? 'bg-red-100 dark:bg-red-900/20' : 
                        'bg-muted/40'
                      }`}>
                        <span className="font-medium">{option.label}.</span>
                        <span className="flex-1">{option.value}</span>
                        {option.key === question.correct_answer && (
                          <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                        )}
                        {option.key === answer?.selected_option && option.key !== question.correct_answer && (
                          <XCircleIcon className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          <div className="flex justify-between pt-6">
            <Link href={`/dashboard/quizzes/${quizId}`} passHref>
              <Button variant="outline">
                <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Quiz
              </Button>
            </Link>
            
            <Link href={`/dashboard/quizzes/${quizId}/attempt`} passHref>
              <Button>Try Again</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}