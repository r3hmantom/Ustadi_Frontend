"use client";

import React, { useState, useEffect } from "react";
import { StaggerContainer, StaggerItem } from "@/components/ui/animated-elements";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Loader2,
  Search,
  Filter,
  PlusCircle,
  TagIcon,
  Calendar,
  XIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Import components
import FlashcardGrid from "./components/FlashcardGrid";
import FlashcardFormModal from "./components/FlashcardFormModal";
import FlashcardReviewModal from "./components/FlashcardReviewModal";
import FlashcardStats from "./components/FlashcardStats";
import FlashcardFilters from "./components/FlashcardFilters";
import FlashcardEmptyState from "./components/FlashcardEmptyState";

// Import types
import { Flashcard, FlashcardFilters as FilterType } from "./types";

export default function RevisionsPage() {
  // States
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null);
  
  // Filter states
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<FilterType>({
    searchQuery: '',
    selectedTags: [],
    dueSoon: false
  });
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  // Current user ID (hardcoded for now, should come from auth)
  const currentUserId = 1;

  // Load flashcards on component mount
  useEffect(() => {
    fetchFlashcards();
  }, []);
  
  // Update filtered flashcards when flashcards or filters change
  useEffect(() => {
    filterFlashcards();
  }, [flashcards, filters, activeTab]);
  
  // Extract all unique tags from flashcards
  useEffect(() => {
    if (flashcards.length > 0) {
      const tags = new Set<string>();
      flashcards.forEach(card => {
        card.tags?.forEach(tag => {
          if (tag) tags.add(tag);
        });
      });
      setAllTags(Array.from(tags));
    }
  }, [flashcards]);

  // Fetch flashcards from API
  const fetchFlashcards = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/revisions?student_id=1');
      if (!response.ok) {
        throw new Error('Failed to fetch flashcards');
      }
      
      const data = await response.json();
      setFlashcards(data);
    } catch (err) {
      setError('Error loading flashcards. Please try again.');
      console.error('Error fetching flashcards:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter flashcards based on search, tags, and active tab
  const filterFlashcards = () => {
    let filtered = [...flashcards];
    
    // Filter by active tab
    if (activeTab === 'due') {
      const now = new Date();
      filtered = filtered.filter(card => new Date(card.next_review_date) <= now);
    } else if (activeTab === 'my') {
      filtered = filtered.filter(card => card.student_id === currentUserId);
    }
    
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(card => 
        card.front_content.toLowerCase().includes(query) || 
        card.back_content.toLowerCase().includes(query)
      );
    }
    
    // Filter by selected tags
    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter(card => 
        filters.selectedTags.some(tag => card.tags?.includes(tag))
      );
    }
    
    // Filter by due soon
    if (filters.dueSoon) {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      
      filtered = filtered.filter(card => {
        const reviewDate = new Date(card.next_review_date);
        return reviewDate <= tomorrow;
      });
    }
    
    setFilteredFlashcards(filtered);
  };
  
  // Create flashcard
  const handleCreateFlashcard = async (flashcardData: { front_content: string; back_content: string; tags: string[] }) => {
    try {
      const response = await fetch('/api/revisions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...flashcardData,
          student_id: currentUserId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create flashcard');
      }
      
      const createdFlashcard = await response.json();
      
      // Update local state
      setFlashcards([...flashcards, createdFlashcard]);
      
      // Close modal
      setShowFormModal(false);
    } catch (err) {
      console.error('Error creating flashcard:', err);
      setError('Error creating flashcard. Please try again.');
    }
  };
  
  // Delete flashcard
  const handleDeleteFlashcard = async (flashcardId: number) => {
    if (!confirm('Are you sure you want to delete this flashcard?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/revisions/${flashcardId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete flashcard');
      }
      
      // Update local state
      setFlashcards(flashcards.filter(card => card.flashcard_id !== flashcardId));
    } catch (err) {
      console.error('Error deleting flashcard:', err);
      setError('Error deleting flashcard. Please try again.');
    }
  };
  
  // Start review for a flashcard
  const startReview = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard);
    setShowReviewModal(true);
  };
  
  // Handle review completion
  const handleReviewComplete = async (flashcardId: number, quality: number) => {
    try {
      const response = await fetch(`/api/revisions/${flashcardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review_quality: quality,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update flashcard');
      }
      
      const updatedFlashcard = await response.json();
      
      // Update local state
      setFlashcards(flashcards.map(card => 
        card.flashcard_id === flashcardId ? updatedFlashcard : card
      ));
      
      // Close review modal
      setShowReviewModal(false);
      setSelectedFlashcard(null);
    } catch (err) {
      console.error('Error updating flashcard:', err);
      setError('Error updating flashcard. Please try again.');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">Revisions</h1>
        <p className="text-gray-600">Create flashcards and review them with spaced repetition</p>
      </div>
      
      <FlashcardStats 
        totalCards={flashcards.length}
        dueCards={flashcards.filter(card => new Date(card.next_review_date) <= new Date()).length}
      />
      
      <Card className="bg-white mb-6 mt-6">
        <CardHeader className="border-b-4 border-black">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                type="text"
                placeholder="Search flashcards..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              
              <Button 
                variant="neuPrimary" 
                className="gap-2"
                onClick={() => setShowFormModal(true)}
              >
                <PlusCircle size={16} />
                New Flashcard
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <FlashcardFilters 
              allTags={allTags}
              selectedTags={filters.selectedTags}
              dueSoon={filters.dueSoon}
              onTagsChange={(tags) => setFilters({ ...filters, selectedTags: tags })}
              onDueSoonChange={(due) => setFilters({ ...filters, dueSoon: due })}
              onClearFilters={() => setFilters({ searchQuery: '', selectedTags: [], dueSoon: false })}
            />
          )}
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Flashcards</TabsTrigger>
              <TabsTrigger value="due">Due for Review</TabsTrigger>
              <TabsTrigger value="my">My Flashcards</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
              ) : (
                <>
                  {filteredFlashcards.length > 0 ? (
                    <FlashcardGrid 
                      flashcards={filteredFlashcards} 
                      onReview={startReview}
                      onDelete={handleDeleteFlashcard}
                    />
                  ) : (
                    <FlashcardEmptyState 
                      activeTab={activeTab}
                      searchQuery={filters.searchQuery}
                      hasFilters={filters.selectedTags.length > 0 || filters.dueSoon}
                      onCreateNew={() => setShowFormModal(true)}
                    />
                  )}
                </>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {showFormModal && (
        <FlashcardFormModal 
          onClose={() => setShowFormModal(false)}
          onCreate={handleCreateFlashcard}
          existingTags={allTags}
          error={error}
        />
      )}
      
      {showReviewModal && selectedFlashcard && (
        <FlashcardReviewModal 
          flashcard={selectedFlashcard}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedFlashcard(null);
          }}
          onComplete={handleReviewComplete}
        />
      )}
    </div>
  );
}