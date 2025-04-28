import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TagIcon, Clock, XIcon } from "lucide-react";

interface FlashcardFiltersProps {
  allTags: string[];
  selectedTags: string[];
  dueSoon: boolean;
  onTagsChange: (tags: string[]) => void;
  onDueSoonChange: (due: boolean) => void;
  onClearFilters: () => void;
}

const FlashcardFilters: React.FC<FlashcardFiltersProps> = ({
  allTags,
  selectedTags,
  dueSoon,
  onTagsChange,
  onDueSoonChange,
  onClearFilters
}) => {
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-700">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearFilters}
          className="text-sm text-gray-500 hover:text-black"
          disabled={selectedTags.length === 0 && !dueSoon}
        >
          <XIcon size={14} className="mr-1" /> Clear all
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Due Soon Filter */}
        <div>
          <div className="flex items-center mb-2">
            <Clock size={16} className="mr-2 text-gray-500" />
            <h4 className="font-medium">Time</h4>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="due-soon" 
              checked={dueSoon} 
              onCheckedChange={() => onDueSoonChange(!dueSoon)} 
            />
            <label 
              htmlFor="due-soon" 
              className="text-sm cursor-pointer"
            >
              Due soon
            </label>
          </div>
        </div>
        
        {/* Tags Filter */}
        <div>
          <div className="flex items-center mb-2">
            <TagIcon size={16} className="mr-2 text-gray-500" />
            <h4 className="font-medium">Tags</h4>
          </div>
          
          {allTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag, index) => (
                <div 
                  key={index}
                  onClick={() => handleTagToggle(tag)}
                  className={`cursor-pointer text-sm px-2 py-1 rounded-md ${
                    selectedTags.includes(tag) 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No tags available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardFilters;