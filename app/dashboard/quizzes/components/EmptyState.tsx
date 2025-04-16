import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";

interface EmptyStateProps {
  activeTab: string;
  searchQuery: string;
  publicFilter: boolean | null;
  onNewQuiz: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  activeTab,
  searchQuery,
  publicFilter,
  onNewQuiz,
}) => {
  // Generate appropriate message based on filters
  const getMessage = () => {
    if (activeTab === 'my') {
      return "You haven't created any quizzes yet.";
    } else if (activeTab === 'public') {
      return "No public quizzes are available.";
    } else if (searchQuery || publicFilter !== null) {
      return "No quizzes match your filters.";
    } else {
      return "Create your first quiz to get started!";
    }
  };

  return (
    <div className="text-center py-16">
      <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
        <BookOpen size={36} className="text-gray-400" />
      </div>
      <h3 className="font-bold text-xl mb-1">No quizzes found</h3>
      <p className="text-gray-500 mb-6">{getMessage()}</p>
      <Button 
        variant="neuPrimary"
        onClick={onNewQuiz}
        className="gap-1"
      >
        <Plus size={16} />
        Create Quiz
      </Button>
    </div>
  );
};

export default EmptyState;