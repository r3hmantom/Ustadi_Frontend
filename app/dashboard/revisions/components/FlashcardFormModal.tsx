import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XIcon, Plus } from "lucide-react";

interface FlashcardFormModalProps {
  onClose: () => void;
  onCreate: (data: { front_content: string; back_content: string; tags: string[] }) => Promise<void>;
  existingTags: string[];
  error: string | null;
}

const FlashcardFormModal: React.FC<FlashcardFormModalProps> = ({
  onClose,
  onCreate,
  existingTags,
  error
}) => {
  const [formData, setFormData] = useState({
    front_content: '',
    back_content: '',
    tagInput: '',
    tags: [] as string[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleAddTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: ''
      });
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };
  
  const handleSelectExistingTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.front_content || !formData.back_content) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onCreate({
        front_content: formData.front_content,
        back_content: formData.back_content,
        tags: formData.tags
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="border-b-4 border-black">
          <CardTitle>Create New Flashcard</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div>
                <label htmlFor="front_content" className="block text-sm font-bold mb-2">
                  Front Side
                </label>
                <textarea
                  id="front_content"
                  name="front_content"
                  value={formData.front_content}
                  onChange={handleChange}
                  placeholder="Question or concept"
                  required
                  rows={3}
                  className="border-black bg-white text-black placeholder:text-gray-400 rounded-[6px] border-[3px] w-full px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-visible:border-black focus-visible:ring-black focus-visible:ring-[3px] transition-all outline-none"
                />
              </div>
              
              <div>
                <label htmlFor="back_content" className="block text-sm font-bold mb-2">
                  Back Side
                </label>
                <textarea
                  id="back_content"
                  name="back_content"
                  value={formData.back_content}
                  onChange={handleChange}
                  placeholder="Answer or explanation"
                  required
                  rows={3}
                  className="border-black bg-white text-black placeholder:text-gray-400 rounded-[6px] border-[3px] w-full px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-visible:border-black focus-visible:ring-black focus-visible:ring-[3px] transition-all outline-none"
                />
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-bold mb-2">
                  Tags
                </label>
                <div className="flex gap-2">
                  <Input
                    id="tagInput"
                    name="tagInput"
                    value={formData.tagInput}
                    onChange={handleChange}
                    placeholder="Add a tag"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md"
                      >
                        {tag}
                        <XIcon 
                          size={14} 
                          className="cursor-pointer" 
                          onClick={() => handleRemoveTag(tag)} 
                        />
                      </span>
                    ))}
                  </div>
                )}
                
                {existingTags.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Suggested tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {existingTags
                        .filter(tag => !formData.tags.includes(tag))
                        .slice(0, 5)
                        .map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSelectExistingTag(tag)}
                          >
                            {tag}
                          </span>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="neuPrimary"
              disabled={isSubmitting || !formData.front_content || !formData.back_content}
            >
              {isSubmitting ? 'Creating...' : 'Create Flashcard'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default FlashcardFormModal;