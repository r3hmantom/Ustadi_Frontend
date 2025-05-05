"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/lib/hooks/useUser";
import { 
  fetchQuiz, 
  startQuizAttempt, 
  submitAnswer, 
  completeQuizAttempt 
} from "@/app/services/quizService";
import { Question, QuizAnswer, QuizAttempt } from "@/db/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AttemptQuestion from "../../attempt-question";
import { toast } from "sonner";
import { ArrowLeftIcon, CheckCircleIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";

export default function QuizAttemptPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = parseInt(params.id as string, 10);
  const { user, isLoading: isUserLoading } = useUser();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (isNaN(quizId)) {
        toast.error("Invalid quiz ID");
        router.push("/dashboard/quizzes");
        return;
      }

      try {
        const quizData = await fetchQuiz(quizId);
        setQuiz(quizData);
        
        if (quizData.questions.length === 0) {
          toast.error("This quiz has no questions");
          router.push(`/dashboard/quizzes/${quizId}`);
          return;
        }
        
        setQuestions(quizData.questions);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
        toast.error("Failed to load quiz");
        router.push("/dashboard/quizzes");
      }
    };

    fetchQuizData();
  }, [quizId, router]);

  useEffect(() => {
    const initializeAttempt = async () => {
      if (!user?.studentId || !quiz) return;
      
      try {
        const newAttempt = await startQuizAttempt(
          quizId, 
          user.studentId, 
          questions.length
        );
        setAttempt(newAttempt);
      } catch (error) {
        console.error("Failed to start quiz attempt:", error);
        toast.error("Failed to start quiz attempt");
      }
    };

    if (!loading && user && !attempt) {
      initializeAttempt();
    }
  }, [loading, user, quiz, quizId, questions.length, attempt]);

  const handleAnswer = async (selectedOption: "a" | "b" | "c" | "d") => {
    if (!attempt) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    try {
      await submitAnswer(attempt.attempt_id, currentQuestion.question_id, selectedOption);
      
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.question_id]: selectedOption
      }));
    } catch (error) {
      console.error("Failed to submit answer:", error);
      toast.error("Failed to save your answer");
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!attempt) return;
    
    setSubmitting(true);
    try {
      const completedAttempt = await completeQuizAttempt(attempt.attempt_id);
      router.push(`/dashboard/quizzes/${quizId}/results/${attempt.attempt_id}`);
    } catch (error) {
      console.error("Failed to complete quiz attempt:", error);
      toast.error("Failed to submit quiz");
      setSubmitting(false);
    }
  };

  if (loading || isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2Icon className="h-8 w-8 animate-spin mb-4" />
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto my-8">
        <AlertDescription>
          You must be logged in to take a quiz. Please sign in and try again.
        </AlertDescription>
      </Alert>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const answeredQuestionsCount = Object.keys(answers).length;
  const allQuestionsAnswered = answeredQuestionsCount === questions.length;

  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          {quiz.description && <p className="text-muted-foreground mt-1">{quiz.description}</p>}
        </div>
        <Link href={`/dashboard/quizzes/${quizId}`} passHref>
          <Button variant="ghost">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Quiz
          </Button>
        </Link>
      </div>

      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          {currentQuestion && (
            <AttemptQuestion
              question={currentQuestion}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onPrevious={handlePrevious}
              selectedOption={answers[currentQuestion.question_id]}
              isLast={isLastQuestion}
              isFirst={isFirstQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              isSubmitting={submitting}
            />
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quiz Progress</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm">
                <div className="flex justify-between mb-2">
                  <span>Questions:</span>
                  <span>{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span>{answeredQuestionsCount}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleComplete}
                disabled={submitting || !allQuestionsAnswered}
              >
                {submitting ? (
                  <><Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                ) : (
                  <><CheckCircleIcon className="mr-2 h-4 w-4" /> Submit Quiz</>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {!allQuestionsAnswered && (
            <p className="text-sm text-muted-foreground">
              Answer all questions to submit the quiz.
            </p>
          )}
          
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, index) => {
              const isAnswered = !!answers[q.question_id];
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <Button
                  key={q.question_id}
                  variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                  className="h-10 w-10 p-0"
                  onClick={() => setCurrentQuestionIndex(index)}
                  disabled={submitting}
                >
                  {index + 1}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}