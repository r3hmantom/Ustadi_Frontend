"use client";

import React, { useState, useEffect } from "react";
import { 
  StaggerContainer, 
  StaggerItem, 
  FadeIn 
} from "@/components/ui/animated-elements";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  BookOpen,
  Plus,
  Search,
  Globe,
  Lock,
  Trash,
  Pencil,
  Loader2,
  Share,
  Filter,
  X,
  SlidersHorizontal,
  Eye,
} from "lucide-react";

// Quiz interface from the API
interface Quiz {
  quiz_id: number;
  student_id: number;
  title: string;
  description: string | null;
  created_at: string;
  is_public: boolean;
  questions_count: number;
}

// Question interface from the API
interface Question {
  question_id: number;
  quiz_id: number;
  question_type: "MCQ" | "Short Answer" | "Long Answer";
  content: string;
  correct_answer: string;
  options?: string[];
}

export default function QuizzesPage() {
  // States
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [publicFilter, setPublicFilter] = useState<boolean | null>(null);
  
  // New quiz form state
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    is_public: false,
    student_id: 1, // Hardcoded for now, should come from auth
  });
  
  // Editing state
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Load quizzes on component mount
  useEffect(() => {
    fetchQuizzes();
  }, []);
  
  // Update filtered quizzes when quizzes, search query, or filters change
  useEffect(() => {
    filterQuizzes();
  }, [quizzes, searchQuery, publicFilter, activeTab]);

  // Fetch quizzes from API
  const fetchQuizzes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/quizzes?student_id=1&is_public=true');
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }
      
      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      setError('Error loading quizzes. Please try again.');
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter quizzes based on search, publicity, and active tab
  const filterQuizzes = () => {
    let filtered = [...quizzes];
    
    // Filter by active tab
    if (activeTab === 'my') {
      filtered = filtered.filter(quiz => quiz.student_id === 1); // Hardcoded ID
    } else if (activeTab === 'public') {
      filtered = filtered.filter(quiz => quiz.is_public === true);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(quiz => 
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (quiz.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      );
    }
    
    // Filter by public/private
    if (publicFilter !== null) {
      filtered = filtered.filter(quiz => quiz.is_public === publicFilter);
    }
    
    setFilteredQuizzes(filtered);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Create quiz
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuiz),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }
      
      const createdQuiz = await response.json();
      
      // Update local state
      setQuizzes([...quizzes, createdQuiz]);
      
      // Reset form and close modal
      setNewQuiz({
        title: '',
        description: '',
        is_public: false,
        student_id: 1,
      });
      setShowQuizModal(false);
    } catch (err) {
      console.error('Error creating quiz:', err);
      setError('Error creating quiz. Please try again.');
    }
  };
  
  // Update quiz
  const handleUpdateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingQuiz) return;
    
    try {
      const response = await fetch(`/api/quizzes/${editingQuiz.quiz_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newQuiz.title,
          description: newQuiz.description,
          is_public: newQuiz.is_public,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update quiz');
      }
      
      const updatedQuiz = await response.json();
      
      // Update local state
      setQuizzes(quizzes.map(q => 
        q.quiz_id === updatedQuiz.quiz_id ? updatedQuiz : q
      ));
      
      // Reset form and close modal
      setEditingQuiz(null);
      setShowQuizModal(false);
    } catch (err) {
      console.error('Error updating quiz:', err);
      setError('Error updating quiz. Please try again.');
    }
  };
  
  // Delete quiz
  const deleteQuiz = async (quizId: number) => {
    if (!confirm('Are you sure you want to delete this quiz?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete quiz');
      }
      
      // Update local state
      setQuizzes(quizzes.filter(q => q.quiz_id !== quizId));
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setError('Error deleting quiz. Please try again.');
    }
  };

  // Quiz form modal
  const QuizFormModal = () => {
    const isEditing = editingQuiz !== null;
    
    // Set form values when editing an existing quiz
    useEffect(() => {
      if (isEditing && editingQuiz) {
        // Only update the newQuiz state if it's actually different
        // to prevent infinite update loops
        if (newQuiz.title !== editingQuiz.title || 
            newQuiz.description !== (editingQuiz.description || '') ||
            newQuiz.is_public !== editingQuiz.is_public ||
            newQuiz.student_id !== editingQuiz.student_id) {
          
          setNewQuiz({
            title: editingQuiz.title,
            description: editingQuiz.description || '',
            is_public: editingQuiz.is_public,
            student_id: editingQuiz.student_id,
          });
        }
      } else {
        // Reset form when not editing
        setNewQuiz({
          title: '',
          description: '',
          is_public: false,
          student_id: 1,
        });
      }
    }, [isEditing, editingQuiz]); // Only run when isEditing or editingQuiz changes
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="border-b-4 border-black">
            <CardTitle>{isEditing ? 'Edit Quiz' : 'Create New Quiz'}</CardTitle>
          </CardHeader>
          <form onSubmit={isEditing ? handleUpdateQuiz : handleCreateQuiz}>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Quiz Title</label>
                  <Input 
                    type="text"
                    value={newQuiz.title} 
                    onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                    placeholder="Enter quiz title" 
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2">Description (optional)</label>
                  <Input 
                    type="text"
                    value={newQuiz.description} 
                    onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                    placeholder="Enter quiz description" 
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="is_public" 
                    checked={newQuiz.is_public}
                    onChange={(e) => setNewQuiz({...newQuiz, is_public: e.target.checked})}
                    className="border-black bg-white data-[state=checked]:bg-[#FFD600] data-[state=checked]:text-black data-[state=checked]:border-black data-[state=checked]:ring-black size-4 shrink-0 rounded-[6px] border-[3px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  />
                  <label htmlFor="is_public" className="font-bold">Make quiz public</label>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                  {error}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-end gap-2">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  setShowQuizModal(false);
                  setEditingQuiz(null);
                  setNewQuiz({
                    title: '',
                    description: '',
                    is_public: false,
                    student_id: 1,
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="neuPrimary">
                {isEditing ? 'Update Quiz' : 'Create Quiz'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">Quizzes</h1>
        <p className="text-gray-600">Create, share and test yourself with interactive quizzes</p>
      </div>
      
      <Card className="bg-white mb-6">
        <CardHeader className="border-b-4 border-black">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                type="text"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-1"
              >
                <SlidersHorizontal size={16} />
                Filters
              </Button>
              
              <Button 
                variant="neuPrimary"
                onClick={() => {
                  setEditingQuiz(null);
                  setShowQuizModal(true);
                }}
                className="gap-1"
              >
                <Plus size={16} />
                New Quiz
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 border-t pt-4 border-gray-200">
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-sm font-bold mb-1">Visibility</p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPublicFilter(publicFilter === true ? null : true)}
                      className={`px-2 py-1 rounded border-2 text-xs font-bold ${
                        publicFilter === true
                          ? 'bg-black text-white border-black'
                          : 'bg-white border-gray-300 hover:border-gray-500'
                      }`}
                    >
                      Public
                    </button>
                    <button
                      onClick={() => setPublicFilter(publicFilter === false ? null : false)}
                      className={`px-2 py-1 rounded border-2 text-xs font-bold ${
                        publicFilter === false
                          ? 'bg-black text-white border-black'
                          : 'bg-white border-gray-300 hover:border-gray-500'
                      }`}
                    >
                      Private
                    </button>
                    {publicFilter !== null && (
                      <button
                        onClick={() => setPublicFilter(null)}
                        className="px-1 rounded hover:bg-gray-100"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Quizzes</TabsTrigger>
              <TabsTrigger value="my">My Quizzes</TabsTrigger>
              <TabsTrigger value="public">Public</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
              ) : (
                <>
                  {filteredQuizzes.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredQuizzes.map(quiz => (
                        <Card 
                          key={quiz.quiz_id}
                          className="border-3 border-black rounded-md bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-xl">{quiz.title}</CardTitle>
                                <p className="text-sm text-gray-500 mt-1">
                                  {formatDate(quiz.created_at)}
                                </p>
                              </div>
                              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 border-2 border-black">
                                {quiz.is_public ? (
                                  <Globe size={16} />
                                ) : (
                                  <Lock size={16} />
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pb-2">
                            {quiz.description && (
                              <p className="text-gray-600 mb-3 line-clamp-2">{quiz.description}</p>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border-2 border-gray-300 bg-white text-xs">
                                <BookOpen size={12} className="text-blue-500" />
                                {quiz.questions_count} {quiz.questions_count === 1 ? 'question' : 'questions'}
                              </span>
                            </div>
                          </CardContent>
                          
                          <CardFooter className="flex justify-between pt-2 pb-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="gap-1"
                              onClick={() => window.location.href = `/dashboard/quizzes/${quiz.quiz_id}`}
                            >
                              <Eye size={14} />
                              View
                            </Button>
                            
                            {quiz.student_id === 1 && ( // Only show edit/delete for user's own quizzes
                              <div className="flex gap-1">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setEditingQuiz(quiz);
                                    setShowQuizModal(true);
                                  }}
                                >
                                  <Pencil size={14} />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => deleteQuiz(quiz.quiz_id)}
                                >
                                  <Trash size={14} />
                                </Button>
                              </div>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen size={36} className="text-gray-400" />
                      </div>
                      <h3 className="font-bold text-xl mb-1">No quizzes found</h3>
                      <p className="text-gray-500 mb-6">
                        {activeTab === 'my'
                          ? "You haven't created any quizzes yet."
                          : activeTab === 'public'
                          ? "No public quizzes are available."
                          : searchQuery || publicFilter !== null
                          ? "No quizzes match your filters."
                          : "Create your first quiz to get started!"}
                      </p>
                      <Button 
                        variant="neuPrimary"
                        onClick={() => {
                          setEditingQuiz(null);
                          setShowQuizModal(true);
                        }}
                        className="gap-1"
                      >
                        <Plus size={16} />
                        Create Quiz
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {showQuizModal && <QuizFormModal />}
    </div>
  );
}