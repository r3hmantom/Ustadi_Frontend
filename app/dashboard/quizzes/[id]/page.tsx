"use client";

import React, { useState, useEffect } from "react";
import { StaggerContainer, StaggerItem } from "@/components/ui/animated-elements";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BookOpen,
  Plus,
  Loader2,
  CheckCircle,
  Globe,
  Lock,
  Pencil,
  Trash,
  ArrowLeft,
  Save,
  Edit,
  Share,
} from "lucide-react";
import Link from "next/link";

// Quiz and Question types
interface Quiz {
  quiz_id: number;
  student_id: number;
  title: string;
  description: string | null;
  created_at: string;
  is_public: boolean;
  questions_count: number;
  questions?: Question[];
}

interface Question {
  question_id: number;
  quiz_id: number;
  question_type: "MCQ" | "Short Answer" | "Long Answer";
  content: string;
  correct_answer: string;
  options?: string[];
  user_answer?: string;
}

// Result type for quiz completion
interface QuizResult {
  total: number;
  correct: number;
  incorrect: number;
  score: number;
  questions: {
    question_id: number;
    content: string;
    user_answer: string;
    correct_answer: string;
    is_correct: boolean;
  }[];
}

export default function QuizDetailPage({ params }: { params: { id: string } }) {
  // States
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"view" | "edit" | "take" | "result">("view");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  
  // State for editing questions
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question_type: "MCQ",
    content: "",
    correct_answer: "",
    options: ["", ""]
  });
  
  // State for taking quiz
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  
  // Fetch quiz data on component mount
  useEffect(() => {
    fetchQuiz();
  }, [params.id]);
  
  // Fetch quiz data
  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/quizzes/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }
      
      const data = await response.json();
      setQuiz(data);
    } catch (err) {
      setError('Error loading quiz. Please try again.');
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Handle adding a new question
  const handleAddQuestion = async () => {
    if (!quiz) return;
    
    try {
      // Validate question
      if (!newQuestion.content || !newQuestion.correct_answer) {
        setError("Question content and correct answer are required");
        return;
      }
      
      if (newQuestion.question_type === "MCQ" && 
          (!newQuestion.options || 
           !newQuestion.options[0] || 
           !newQuestion.options[1])) {
        setError("MCQ questions must have at least 2 options");
        return;
      }
      
      const response = await fetch(`/api/quizzes/${quiz.quiz_id}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add question');
      }
      
      const addedQuestion = await response.json();
      
      // Update local state
      setQuiz(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          questions: [...(prev.questions || []), addedQuestion],
          questions_count: (prev.questions_count || 0) + 1
        };
      });
      
      // Reset form
      setNewQuestion({
        question_type: "MCQ",
        content: "",
        correct_answer: "",
        options: ["", ""]
      });
      
    } catch (err) {
      console.error('Error adding question:', err);
      setError('Error adding question. Please try again.');
    }
  };
  
  // Handle deleting a question
  const deleteQuestion = async (questionId: number) => {
    if (!quiz) return;
    
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }
    
    try {
      // This API endpoint is not implemented yet, but we'll simulate it
      // In a real implementation, we would call:
      // const response = await fetch(`/api/quizzes/${quiz.quiz_id}/questions/${questionId}`, {
      //   method: 'DELETE',
      // });
      
      // Simulate successful deletion
      // Update local state
      setQuiz(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          questions: prev.questions?.filter(q => q.question_id !== questionId) || [],
          questions_count: Math.max(0, (prev.questions_count || 0) - 1)
        };
      });
      
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('Error deleting question. Please try again.');
    }
  };
  
  // Handle user answering a question
  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  // Submit quiz answers
  const submitQuiz = () => {
    if (!quiz || !quiz.questions) return;
    
    // Calculate results
    const results: QuizResult = {
      total: quiz.questions.length,
      correct: 0,
      incorrect: 0,
      score: 0,
      questions: []
    };
    
    quiz.questions.forEach(question => {
      const userAnswer = userAnswers[question.question_id] || "";
      const isCorrect = userAnswer.toLowerCase() === question.correct_answer.toLowerCase();
      
      if (isCorrect) {
        results.correct++;
      } else {
        results.incorrect++;
      }
      
      results.questions.push({
        question_id: question.question_id,
        content: question.content,
        user_answer: userAnswer,
        correct_answer: question.correct_answer,
        is_correct: isCorrect
      });
    });
    
    // Calculate score percentage
    results.score = Math.round((results.correct / results.total) * 100);
    
    // Set quiz result and change mode to result
    setQuizResult(results);
    setMode("result");
  };
  
  // Create question form for edit mode
  const QuestionForm = () => {
    return (
      <Card className="mb-6 border-black border-3">
        <CardHeader className="border-b border-black">
          <CardTitle>Add New Question</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Question Type</label>
              <select 
                className="border-black bg-white text-black placeholder:text-gray-400 rounded-[6px] border-[3px] w-full px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-visible:border-black focus-visible:ring-black focus-visible:ring-[3px] transition-all outline-none"
                value={newQuestion.question_type} 
                onChange={(e) => setNewQuestion({
                  ...newQuestion, 
                  question_type: e.target.value as "MCQ" | "Short Answer" | "Long Answer"
                })}
              >
                <option value="MCQ">Multiple Choice</option>
                <option value="Short Answer">Short Answer</option>
                <option value="Long Answer">Long Answer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">Question</label>
              <Input 
                type="text"
                value={newQuestion.content || ''} 
                onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                placeholder="Enter your question" 
                required
              />
            </div>
            
            {newQuestion.question_type === "MCQ" && (
              <div>
                <label className="block text-sm font-bold mb-2">Options</label>
                <div className="grid gap-2">
                  {newQuestion.options?.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        type="text"
                        value={option} 
                        onChange={(e) => {
                          const newOptions = [...(newQuestion.options || [])];
                          newOptions[index] = e.target.value;
                          setNewQuestion({...newQuestion, options: newOptions});
                        }}
                        placeholder={`Option ${index + 1}`} 
                        required
                      />
                      {index >= 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                          onClick={() => {
                            const newOptions = [...(newQuestion.options || [])];
                            newOptions.splice(index, 1);
                            setNewQuestion({...newQuestion, options: newOptions});
                          }}
                        >
                          <Trash size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      setNewQuestion({
                        ...newQuestion, 
                        options: [...(newQuestion.options || []), ""]
                      });
                    }}
                  >
                    <Plus size={16} className="mr-2" /> Add Option
                  </Button>
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold mb-2">
                {newQuestion.question_type === "MCQ" ? "Correct Option" : "Correct Answer"}
              </label>
              {newQuestion.question_type === "MCQ" ? (
                <select 
                  className="border-black bg-white text-black placeholder:text-gray-400 rounded-[6px] border-[3px] w-full px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-visible:border-black focus-visible:ring-black focus-visible:ring-[3px] transition-all outline-none"
                  value={newQuestion.correct_answer || ''} 
                  onChange={(e) => setNewQuestion({...newQuestion, correct_answer: e.target.value})}
                >
                  <option value="">Select correct answer</option>
                  {newQuestion.options?.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <Input 
                  type="text"
                  value={newQuestion.correct_answer || ''} 
                  onChange={(e) => setNewQuestion({...newQuestion, correct_answer: e.target.value})}
                  placeholder="Enter correct answer" 
                  required
                />
              )}
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="neuPrimary"
            onClick={handleAddQuestion}
          >
            Add Question
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Create a component for displaying a question in view mode
  const ViewQuestion = ({ question, index }: { question: Question; index: number }) => {
    return (
      <Card className="mb-4 border-black border-3">
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <h3 className="font-bold text-lg mb-2">Question {index + 1}</h3>
            <span className="inline-flex items-center text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md border-2 border-blue-300">
              {question.question_type}
            </span>
          </div>
          <p className="mb-4">{question.content}</p>
          
          {question.question_type === "MCQ" && question.options && (
            <div className="pl-4 space-y-2">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${
                    option === question.correct_answer
                    ? "bg-green-100 border-green-500 text-green-700"
                    : "border-gray-300"
                  }`}>
                    {option === question.correct_answer && <CheckCircle size={16} />}
                  </span>
                  <span>{option}</span>
                </div>
              ))}
            </div>
          )}
          
          {question.question_type !== "MCQ" && (
            <div className="mt-4">
              <p className="font-bold text-sm mb-1">Correct Answer:</p>
              <p className="pl-4 border-l-4 border-green-500 bg-green-50 p-2">
                {question.correct_answer}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-red-500"
            onClick={() => deleteQuestion(question.question_id)}
          >
            <Trash size={16} />
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Create a component for answering a question in take mode
  const TakeQuestion = ({ question, index }: { question: Question; index: number }) => {
    const userAnswer = userAnswers[question.question_id] || "";
    
    return (
      <Card className="mb-4 border-black border-3">
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <h3 className="font-bold text-lg mb-2">Question {index + 1}</h3>
            <span className="inline-flex items-center text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md border-2 border-blue-300">
              {question.question_type}
            </span>
          </div>
          <p className="mb-4">{question.content}</p>
          
          {question.question_type === "MCQ" && question.options && (
            <div className="pl-4 space-y-2">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`question-${question.question_id}-option-${optionIndex}`}
                    name={`question-${question.question_id}`}
                    value={option}
                    checked={userAnswer === option}
                    onChange={() => handleAnswerChange(question.question_id, option)}
                    className="border-black bg-white data-[state=checked]:bg-[#FFD600] data-[state=checked]:text-black data-[state=checked]:border-black data-[state=checked]:ring-black size-4 shrink-0 rounded-full border-[3px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  />
                  <label htmlFor={`question-${question.question_id}-option-${optionIndex}`}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          )}
          
          {question.question_type === "Short Answer" && (
            <div className="mt-4">
              <Input
                type="text"
                placeholder="Your answer"
                value={userAnswer}
                onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
              />
            </div>
          )}
          
          {question.question_type === "Long Answer" && (
            <div className="mt-4">
              <textarea
                placeholder="Your answer"
                value={userAnswer}
                onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
                className="border-black bg-white text-black placeholder:text-gray-400 rounded-[6px] border-[3px] w-full px-4 py-2 h-32 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-visible:border-black focus-visible:ring-black focus-visible:ring-[3px] transition-all outline-none"
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // Component to show quiz results
  const QuizResultView = () => {
    if (!quizResult) return null;
    
    return (
      <div>
        <Card className="mb-6 border-black border-3">
          <CardHeader className="border-b border-black bg-gray-50">
            <CardTitle className="flex justify-between items-center">
              <span>Quiz Results</span>
              <div className="text-lg">
                Score: <span className="font-bold text-xl">{quizResult.score}%</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-100 p-4 rounded-lg border-2 border-green-500 text-center">
                <h3 className="font-bold mb-1">Correct</h3>
                <p className="text-2xl font-bold text-green-700">{quizResult.correct}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg border-2 border-red-500 text-center">
                <h3 className="font-bold mb-1">Incorrect</h3>
                <p className="text-2xl font-bold text-red-700">{quizResult.incorrect}</p>
              </div>
            </div>
            
            <h3 className="font-bold mb-4">Question Results:</h3>
            
            {quizResult.questions.map((q, index) => (
              <div 
                key={q.question_id} 
                className={`p-4 mb-4 rounded-lg border-2 ${q.is_correct ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}
              >
                <h4 className="font-bold mb-2">Question {index + 1}</h4>
                <p className="mb-2">{q.content}</p>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-sm font-bold mb-1">Your Answer:</p>
                    <p className={`px-3 py-1 rounded ${q.is_correct ? 'bg-green-100' : 'bg-red-100'}`}>
                      {q.user_answer || "(No answer)"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold mb-1">Correct Answer:</p>
                    <p className="px-3 py-1 rounded bg-green-100">
                      {q.correct_answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setMode("view")}>
              <ArrowLeft size={16} className="mr-2" /> Back to Quiz
            </Button>
            <Button variant="neuPrimary" onClick={() => {
              setUserAnswers({});
              setMode("take");
            }}>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  // Error state
  if (error && !quiz) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-md inline-block">
          {error}
        </div>
        <div className="mt-6">
          <Button variant="neuPrimary" asChild>
            <Link href="/dashboard/quizzes">
              <ArrowLeft size={16} className="mr-2" /> Back to Quizzes
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // If no quiz found
  if (!quiz) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-md inline-block">
          Quiz not found
        </div>
        <div className="mt-6">
          <Button variant="neuPrimary" asChild>
            <Link href="/dashboard/quizzes">
              <ArrowLeft size={16} className="mr-2" /> Back to Quizzes
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/quizzes">
              <ArrowLeft size={16} className="mr-1" /> Back
            </Link>
          </Button>
          
          <div className="flex items-center text-sm">
            <span className={`inline-flex items-center px-2 py-1 rounded-full ${
              quiz.is_public 
              ? "bg-green-100 text-green-700 border border-green-500" 
              : "bg-gray-100 text-gray-700 border border-gray-500"
            }`}>
              {quiz.is_public ? (
                <><Globe size={14} className="mr-1" /> Public</>
              ) : (
                <><Lock size={14} className="mr-1" /> Private</>
              )}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black mb-2">{quiz.title}</h1>
            <p className="text-gray-600 mb-1">
              Created on {formatDate(quiz.created_at)}
            </p>
            {quiz.description && (
              <p className="text-gray-600 max-w-2xl">{quiz.description}</p>
            )}
          </div>
          
          <div className="flex gap-2">
            {mode === "view" && (
              <>
                <Button 
                  variant="outline" 
                  className="gap-1"
                  onClick={() => {
                    setUserAnswers({});
                    setMode("take");
                  }}
                >
                  <BookOpen size={16} />
                  Take Quiz
                </Button>
                
                {quiz.student_id === 1 && ( // Only show for user's own quizzes
                  <Button 
                    variant="neuPrimary" 
                    className="gap-1"
                    onClick={() => setMode("edit")}
                  >
                    <Edit size={16} />
                    Edit Quiz
                  </Button>
                )}
              </>
            )}
            
            {mode === "edit" && (
              <>
                <Button 
                  variant="outline" 
                  className="gap-1"
                  onClick={() => setMode("view")}
                >
                  Cancel
                </Button>
                
                <Button 
                  variant="neuPrimary" 
                  className="gap-1"
                  onClick={() => setMode("view")}
                >
                  <Save size={16} />
                  Save Changes
                </Button>
              </>
            )}
            
            {mode === "take" && (
              <>
                <Button 
                  variant="outline" 
                  className="gap-1"
                  onClick={() => setMode("view")}
                >
                  <ArrowLeft size={16} />
                  Back
                </Button>
                
                <Button 
                  variant="neuPrimary" 
                  className="gap-1"
                  onClick={submitQuiz}
                >
                  <CheckCircle size={16} />
                  Submit Answers
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Question Count Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-lg font-bold">
          {quiz.questions_count} {quiz.questions_count === 1 ? 'Question' : 'Questions'}
        </div>
        
        {mode === "take" && quiz.questions && quiz.questions.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              Question {activeQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm"
                disabled={activeQuestionIndex === 0}
                onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={activeQuestionIndex === quiz.questions.length - 1}
                onClick={() => setActiveQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Quiz Content - conditional based on mode */}
      {mode === "view" && (
        <div>
          {quiz.questions && quiz.questions.length > 0 ? (
            quiz.questions.map((question, index) => (
              <ViewQuestion key={question.question_id} question={question} index={index} />
            ))
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-gray-200">
              <BookOpen size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="font-bold text-xl mb-2">No questions yet</h3>
              <p className="text-gray-500 mb-6">This quiz doesn't have any questions.</p>
              
              {quiz.student_id === 1 && (
                <Button 
                  variant="neuPrimary"
                  onClick={() => setMode("edit")}
                >
                  <Plus size={16} className="mr-2" /> Add Questions
                </Button>
              )}
            </div>
          )}
        </div>
      )}
      
      {mode === "edit" && (
        <div>
          <QuestionForm />
          
          <h2 className="font-bold text-xl mb-4">Questions</h2>
          
          {quiz.questions && quiz.questions.length > 0 ? (
            quiz.questions.map((question, index) => (
              <ViewQuestion key={question.question_id} question={question} index={index} />
            ))
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-gray-200">
              <p className="text-gray-500">No questions added yet. Add your first question above.</p>
            </div>
          )}
        </div>
      )}
      
      {mode === "take" && quiz.questions && quiz.questions.length > 0 && (
        <div>
          <TakeQuestion 
            question={quiz.questions[activeQuestionIndex]} 
            index={activeQuestionIndex} 
          />
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline"
              disabled={activeQuestionIndex === 0}
              onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
            >
              Previous Question
            </Button>
            
            {activeQuestionIndex < quiz.questions.length - 1 ? (
              <Button 
                variant="neuPrimary"
                onClick={() => setActiveQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
              >
                Next Question
              </Button>
            ) : (
              <Button 
                variant="neuPrimary"
                onClick={submitQuiz}
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </div>
      )}
      
      {mode === "result" && <QuizResultView />}
    </div>
  );
}