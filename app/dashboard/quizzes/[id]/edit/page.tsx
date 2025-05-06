"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/lib/hooks/useUser";
import {
  fetchQuiz,
  updateQuiz,
  addQuestion,
  deleteQuestion,
  QuizFormData,
  McqQuestionFormData,
} from "@/app/services/quizService";
import { Question, Quiz } from "@/db/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  PlusIcon,
  Trash2Icon,
  SaveIcon,
  Loader2Icon,
} from "lucide-react";
import Link from "next/link";
import McqQuestionForm from "../../mcq-question-form";

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = parseInt(params.id as string, 10);
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [quizForm, setQuizForm] = useState<QuizFormData>({
    title: "",
    description: "",
    is_public: false,
  });

  const [activeTab, setActiveTab] = useState<string>("details");
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

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
        setQuestions(quizData.questions);
        setQuizForm({
          title: quizData.title,
          description: quizData.description || "",
          is_public: Boolean(quizData.is_public),
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
        toast.error("Failed to load quiz");
        router.push("/dashboard/quizzes");
      }
    };

    fetchQuizData();
  }, [quizId, router]);

  // Check if quiz belongs to current user
  useEffect(() => {
    if (!loading && quiz && user && quiz.student_id !== user.studentId) {
      toast.error("You don't have permission to edit this quiz");
      router.push("/dashboard/quizzes");
    }
  }, [quiz, user, router, loading]);

  const handleQuizFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setQuizForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setQuizForm((prev) => ({ ...prev, is_public: checked }));
  };

  const saveQuizDetails = async () => {
    setUpdating(true);
    try {
      await updateQuiz(quizId, quizForm);
      toast.success("Quiz details saved successfully");
    } catch (error) {
      console.error("Failed to update quiz:", error);
      toast.error("Failed to save quiz details");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddQuestion = async (questionData: McqQuestionFormData) => {
    try {
      setAddingQuestion(true);
      const newQuestion = await addQuestion(quizId, questionData);
      setQuestions((prev) => [...prev, newQuestion]);
      toast.success("Question added successfully");
      return true;
    } catch (error) {
      console.error("Failed to add question:", error);
      toast.error("Failed to add question");
      return false;
    } finally {
      setAddingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      await deleteQuestion(questionId);
      setQuestions((prev) => prev.filter((q) => q.question_id !== questionId));
      toast.success("Question deleted successfully");
    } catch (error) {
      console.error("Failed to delete question:", error);
      toast.error("Failed to delete question");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2Icon className="h-8 w-8 animate-spin mb-4" />
        <p>Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Link href={`/dashboard/quizzes/${quizId}`} passHref>
          <Button variant="outline">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Quiz
          </Button>
        </Link>

        {activeTab === "details" && (
          <Button onClick={saveQuizDetails} disabled={updating}>
            {updating ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <SaveIcon className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        )}
      </div>

      <h1 className="text-2xl font-bold">Edit Quiz</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Quiz Details</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                name="title"
                value={quizForm.title}
                onChange={handleQuizFormChange}
                placeholder="Enter quiz title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={quizForm.description || ""}
                onChange={handleQuizFormChange}
                placeholder="Enter quiz description (optional)"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_public"
                checked={!!quizForm.is_public}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="is_public">Make this quiz public</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Questions ({questions.length})</span>
                <Button
                  onClick={() => setIsAddingQuestion(true)}
                  className="ml-auto"
                  size="sm"
                >
                  <PlusIcon className="h-4 w-4 mr-2" /> Add Question
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">
                    No questions added yet. Add your first MCQ question.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <Card key={question.question_id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">
                            Question {index + 1}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() =>
                              handleDeleteQuestion(question.question_id)
                            }
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4 pt-0 space-y-2">
                        <p className="font-medium">{question.content}</p>
                        <div className="grid gap-1 text-sm">
                          {[
                            { key: "a", label: "A", value: question.option_a },
                            { key: "b", label: "B", value: question.option_b },
                            { key: "c", label: "C", value: question.option_c },
                            { key: "d", label: "D", value: question.option_d },
                          ].map((option) => (
                            <div
                              key={option.key}
                              className={
                                option.key === question.correct_answer
                                  ? "text-green-600 dark:text-green-400"
                                  : ""
                              }
                            >
                              <span className="font-medium mr-2">
                                {option.label}.
                              </span>
                              {option.value}
                              {option.key === question.correct_answer &&
                                " (Correct)"}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={saveQuizDetails} disabled={updating}>
                {updating ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {isAddingQuestion && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Add Multiple Choice Question</CardTitle>
              </CardHeader>
              <CardContent>
                <McqQuestionForm
                  onSubmit={async (data) => {
                    const success = await handleAddQuestion(data);
                    if (success) setIsAddingQuestion(false);
                  }}
                  isLoading={addingQuestion}
                />
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsAddingQuestion(false)}
                  disabled={addingQuestion}
                >
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
