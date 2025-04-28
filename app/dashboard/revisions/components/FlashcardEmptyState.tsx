import React from "react";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Plus, Search, Filter } from "lucide-react";

interface FlashcardEmptyStateProps {
  activeTab: string;
  searchQuery: string;
  hasFilters: boolean;
  onCreateNew: () => void;
}

const FlashcardEmptyState: React.FC<FlashcardEmptyStateProps> = ({
  activeTab,
  searchQuery,
  hasFilters,
  onCreateNew
}) => {
  // Generate appropriate message based on filters and active tab
  const getMessage = () => {
    if (searchQuery || hasFilters) {
      return "No flashcards match your filters.";
    }
    
    switch (activeTab) {
      case 'due':
        return "You don't have any flashcards due for review.";
      case 'my':
        return "You haven't created any flashcards yet.";
      default:
        return "Create your first flashcard to start learning!";
    }
  };

  return (
    <div className="text-center py-16">
      <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
        {searchQuery || hasFilters ? (
          <Filter size={36} className="text-gray-400" />
        ) : activeTab === 'due' ? (
          <Clock size={36} className="text-gray-400" />
        ) : (
          <BrainCircuit size={36} className="text-gray-400" />
        )}
      </div>
      
      <h3 className="text-lg font-bold mb-2">No flashcards found</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{getMessage()}</p>
      
      {(activeTab === 'all' || activeTab === 'my') && !searchQuery && !hasFilters && (
        <Button 
          variant="neuPrimary"
          onClick={onCreateNew}
        >
          <Plus size={16} className="mr-2" /> Create New Flashcard
        </Button>
      )}
      
      {(searchQuery || hasFilters) && (
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default FlashcardEmptyState;