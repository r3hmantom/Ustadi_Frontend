"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";
import {
  fetchQuiz,
  updateQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  QuizWithQuestions,
  QuestionFormData,
} from "@/app/services/quizService";

interface QuizEditPageProps {
  params: {
    id: string;
  };
}

export default function QuizEditPage({ params }: QuizEditPageProps) {
  const quizId = parseInt(params.id, 10);
  const { user } = useUser();
  const router = useRouter();

  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // New question state
  const [newQuestion, setNewQuestion] = useState<QuestionFormData>({
    content: "",
    question_type: "MCQ",
    correct_answer: "",
  });

  // Track questions being edited
  const [editingQuestions, setEditingQuestions] = useState<
    Record<number, boolean>
  >({});
  const [editedQuestions, setEditedQuestions] = useState<
    Record<number, QuestionFormData>
  >({});

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

        // Initialize form with quiz data
        setTitle(quizData.title);
        setDescription(quizData.description || "");
        setIsPublic(!!quizData.is_public);

        // Initialize edited questions with existing data
        const edited: Record<number, QuestionFormData> = {};
        quizData.questions.forEach((q) => {
          edited[q.question_id] = {
            content: q.content,
            question_type: q.question_type,
            correct_answer: q.correct_answer,
          };
        });
        setEditedQuestions(edited);

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
      // Redirect if not the owner
      toast.error("You don't have permission to edit this quiz");
      router.push("/dashboard/quizzes");
    }
  }, [quiz, user, router]);

  const handleSaveQuiz = async () => {
    if (!quiz) return;

    setIsSaving(true);
    try {
      await updateQuiz(quizId, {
        title,
        description: description || undefined,
        is_public: isPublic,
      });
      toast.success("Quiz details updated");
    } catch (e) {
      console.error("Failed to update quiz:", e);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!quiz) return;

    setIsSaving(true);
    try {
      const addedQuestion = await addQuestion(quizId, newQuestion);
      // Update local state with new question
      setQuiz({
        ...quiz,
        questions: [...quiz.questions, addedQuestion],
      });
      setEditedQuestions({
        ...editedQuestions,
        [addedQuestion.question_id]: { ...newQuestion },
      });
      // Reset new question form
      setNewQuestion({
        content: "",
        question_type: "MCQ",
        correct_answer: "",
      });
      toast.success("Question added");
    } catch (e) {
      console.error("Failed to add question:", e);
      toast.error("Failed to add question");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditQuestion = (questionId: number) => {
    setEditingQuestions({
      ...editingQuestions,
      [questionId]: true,
    });
  };

  const handleCancelEdit = (questionId: number) => {
    // Reset edited question to original
    const question = quiz?.questions.find((q) => q.question_id === questionId);
    if (question) {
      setEditedQuestions({
        ...editedQuestions,
        [questionId]: {
          content: question.content,
          question_type: question.question_type,
          correct_answer: question.correct_answer,
        },
      });
    }

    // Exit edit mode
    setEditingQuestions({
      ...editingQuestions,
      [questionId]: false,
    });
  };

  const handleSaveQuestion = async (questionId: number) => {
    setIsSaving(true);
    try {
      await updateQuestion(questionId, editedQuestions[questionId]);

      // Update local state
      if (quiz) {
        setQuiz({
          ...quiz,
          questions: quiz.questions.map((q) =>
            q.question_id === questionId
              ? { ...q, ...editedQuestions[questionId] }
              : q
          ),
        });
      }

      // Exit edit mode
      setEditingQuestions({
        ...editingQuestions,
        [questionId]: false,
      });

      toast.success("Question updated");
    } catch (e) {
      console.error("Failed to update question:", e);
      toast.error("Failed to update question");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    setIsSaving(true);
    try {
      await deleteQuestion(questionId);

      // Update local state
      if (quiz) {
        setQuiz({
          ...quiz,
          questions: quiz.questions.filter((q) => q.question_id !== questionId),
        });
      }

      toast.success("Question deleted");
    } catch (e) {
      console.error("Failed to delete question:", e);
      toast.error("Failed to delete question");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-muted-foreground">Loading quiz editor...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/quizzes">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Quizzes
            </Link>
          </Button>
        </div>

        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
          <p>{error || "Quiz not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/quizzes/${quizId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" /> View Quiz
          </Link>
        </Button>

        <Button onClick={handleSaveQuiz} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quiz Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Quiz Details</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px]"
                    disabled={isSaving}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="public"
                    checked={isPublic}
                    onCheckedChange={(checked) => setIsPublic(!!checked)}
                    disabled={isSaving}
                  />
                  <Label htmlFor="public">Make this quiz public</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Questions</h2>

              {/* Existing Questions */}
              <div className="space-y-6">
                {quiz.questions.length === 0 ? (
                  <div className="text-center py-8 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">
                      No questions have been added to this quiz yet.
                    </p>
                  </div>
                ) : (
                  quiz.questions.map((question) => (
                    <div
                      key={question.question_id}
                      className="border rounded-lg p-4"
                    >
                      {editingQuestions[question.question_id] ? (
                        /* Editing Question */
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`question-${question.question_id}`}>
                              Question
                            </Label>
                            <Textarea
                              id={`question-${question.question_id}`}
                              value={
                                editedQuestions[question.question_id]
                                  ?.content || ""
                              }
                              onChange={(e) =>
                                setEditedQuestions({
                                  ...editedQuestions,
                                  [question.question_id]: {
                                    ...editedQuestions[question.question_id],
                                    content: e.target.value,
                                  },
                                })
                              }
                              disabled={isSaving}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`type-${question.question_id}`}>
                              Question Type
                            </Label>
                            <Select
                              value={
                                editedQuestions[question.question_id]
                                  ?.question_type
                              }
                              onValueChange={(value) =>
                                setEditedQuestions({
                                  ...editedQuestions,
                                  [question.question_id]: {
                                    ...editedQuestions[question.question_id],
                                    question_type: value as
                                      | "MCQ"
                                      | "Short Answer"
                                      | "Long Answer",
                                  },
                                })
                              }
                              disabled={isSaving}
                            >
                              <SelectTrigger
                                id={`type-${question.question_id}`}
                              >
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MCQ">
                                  Multiple Choice
                                </SelectItem>
                                <SelectItem value="Short Answer">
                                  Short Answer
                                </SelectItem>
                                <SelectItem value="Long Answer">
                                  Long Answer
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`answer-${question.question_id}`}>
                              Correct Answer
                            </Label>
                            <Textarea
                              id={`answer-${question.question_id}`}
                              value={
                                editedQuestions[question.question_id]
                                  ?.correct_answer || ""
                              }
                              onChange={(e) =>
                                setEditedQuestions({
                                  ...editedQuestions,
                                  [question.question_id]: {
                                    ...editedQuestions[question.question_id],
                                    correct_answer: e.target.value,
                                  },
                                })
                              }
                              disabled={isSaving}
                            />
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() =>
                                handleCancelEdit(question.question_id)
                              }
                              disabled={isSaving}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() =>
                                handleSaveQuestion(question.question_id)
                              }
                              disabled={isSaving}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        /* Viewing Question */
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-medium">
                              {question.question_type}
                            </h3>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleEditQuestion(question.question_id)
                                }
                                disabled={isSaving}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() =>
                                  handleDeleteQuestion(question.question_id)
                                }
                                disabled={isSaving}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="font-medium text-sm mb-1">
                              Question:
                            </div>
                            <div className="text-muted-foreground">
                              {question.content}
                            </div>
                          </div>

                          <div>
                            <div className="font-medium text-sm mb-1">
                              Correct Answer:
                            </div>
                            <div className="text-muted-foreground">
                              {question.correct_answer}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <Separator className="my-6" />

              {/* Add New Question */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Add New Question</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-question">Question</Label>
                    <Textarea
                      id="new-question"
                      value={newQuestion.content}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          content: e.target.value,
                        })
                      }
                      placeholder="Enter your question"
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="question-type">Question Type</Label>
                    <Select
                      value={newQuestion.question_type}
                      onValueChange={(value) =>
                        setNewQuestion({
                          ...newQuestion,
                          question_type: value as
                            | "MCQ"
                            | "Short Answer"
                            | "Long Answer",
                        })
                      }
                      disabled={isSaving}
                    >
                      <SelectTrigger id="question-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MCQ">Multiple Choice</SelectItem>
                        <SelectItem value="Short Answer">
                          Short Answer
                        </SelectItem>
                        <SelectItem value="Long Answer">Long Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="correct-answer">Correct Answer</Label>
                    <Textarea
                      id="correct-answer"
                      value={newQuestion.correct_answer}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          correct_answer: e.target.value,
                        })
                      }
                      placeholder="Enter the correct answer"
                      disabled={isSaving}
                    />
                  </div>

                  <Button
                    onClick={handleAddQuestion}
                    disabled={
                      !newQuestion.content ||
                      !newQuestion.correct_answer ||
                      isSaving
                    }
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Question
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
