"use client";

import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Import types
import { Quiz, NewQuizForm } from "./types";

// Import components
import QuizCard from "./components/QuizCard";
import QuizFormModal from "./components/QuizFormModal";
import QuizFilters from "./components/QuizFilters";
import EmptyState from "./components/EmptyState";

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
  
  // Editing state
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Current user ID (hardcoded for now, should come from auth)
  const currentUserId = 1;

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
      filtered = filtered.filter(quiz => quiz.student_id === currentUserId);
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
  
  // Create quiz
  const handleSubmitQuiz = async (quizData: NewQuizForm) => {
    const isEditing = editingQuiz !== null;
    
    try {
      if (isEditing) {
        // Update existing quiz
        const response = await fetch(`/api/quizzes/${editingQuiz.quiz_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(quizData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update quiz');
        }
        
        const updatedQuiz = await response.json();
        
        // Update local state
        setQuizzes(quizzes.map(q => 
          q.quiz_id === updatedQuiz.quiz_id ? updatedQuiz : q
        ));
      } else {
        // Create new quiz
        const response = await fetch('/api/quizzes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(quizData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create quiz');
        }
        
        const createdQuiz = await response.json();
        
        // Update local state
        setQuizzes([...quizzes, createdQuiz]);
      }
      
      // Reset edit state and close modal
      setEditingQuiz(null);
      setShowQuizModal(false);
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} quiz:`, err);
      setError(`Error ${isEditing ? 'updating' : 'creating'} quiz. Please try again.`);
    }
  };
  
  // Delete quiz
  const handleDeleteQuiz = async (quizId: number) => {
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">Quizzes</h1>
        <p className="text-gray-600">Create, share and test yourself with interactive quizzes</p>
      </div>
      
      <Card className="bg-white mb-6">
        <CardHeader className="border-b-4 border-black">
          <QuizFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            publicFilter={publicFilter}
            setPublicFilter={setPublicFilter}
            onNewQuiz={() => {
              setEditingQuiz(null);
              setShowQuizModal(true);
            }}
          />
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
                        <QuizCard 
                          key={quiz.quiz_id}
                          quiz={quiz}
                          currentUserId={currentUserId}
                          onEdit={(quiz) => {
                            setEditingQuiz(quiz);
                            setShowQuizModal(true);
                          }}
                          onDelete={handleDeleteQuiz}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState 
                      activeTab={activeTab}
                      searchQuery={searchQuery}
                      publicFilter={publicFilter}
                      onNewQuiz={() => {
                        setEditingQuiz(null);
                        setShowQuizModal(true);
                      }}
                    />
                  )}
                </>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {showQuizModal && (
        <QuizFormModal 
          editingQuiz={editingQuiz}
          error={error}
          onClose={() => {
            setShowQuizModal(false);
            setEditingQuiz(null);
          }}
          onSubmit={handleSubmitQuiz}
        />
      )}
    </div>
  );
}