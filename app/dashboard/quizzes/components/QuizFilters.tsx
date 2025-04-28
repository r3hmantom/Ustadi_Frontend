import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, Plus } from "lucide-react";

interface QuizFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  publicFilter: boolean | null;
  setPublicFilter: (isPublic: boolean | null) => void;
  onNewQuiz: () => void;
}

const QuizFilters: React.FC<QuizFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  publicFilter,
  setPublicFilter,
  onNewQuiz,
}) => {
  return (
    <>
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
            onClick={onNewQuiz}
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
    </>
  );
};

export default QuizFilters;