import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

// New quiz form state type
interface NewQuizForm {
  title: string;
  description: string;
  is_public: boolean;
  student_id: number;
}

interface QuizFormModalProps {
  editingQuiz: Quiz | null;
  onClose: () => void;
  onSubmit: (quizData: NewQuizForm) => Promise<void>;
  error: string | null;
}

const QuizFormModal: React.FC<QuizFormModalProps> = ({ 
  editingQuiz, 
  onClose, 
  onSubmit,
  error
}) => {
  const isEditing = editingQuiz !== null;
  
  const [formData, setFormData] = useState<NewQuizForm>({
    title: '',
    description: '',
    is_public: false,
    student_id: 1, // Hardcoded for now, should come from auth
  });
  
  // Set form values when editing an existing quiz
  useEffect(() => {
    if (isEditing && editingQuiz) {
      setFormData({
        title: editingQuiz.title,
        description: editingQuiz.description || '',
        is_public: editingQuiz.is_public,
        student_id: editingQuiz.student_id,
      });
    } else {
      // Reset form when not editing
      setFormData({
        title: '',
        description: '',
        is_public: false,
        student_id: 1,
      });
    }
  }, [isEditing, editingQuiz]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="border-b-4 border-black">
          <CardTitle>{isEditing ? 'Edit Quiz' : 'Create New Quiz'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Quiz Title</label>
                <Input 
                  type="text"
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter quiz title" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Description (optional)</label>
                <Input 
                  type="text"
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter quiz description" 
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="is_public" 
                  checked={formData.is_public}
                  onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
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
              onClick={onClose}
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

export default QuizFormModal;