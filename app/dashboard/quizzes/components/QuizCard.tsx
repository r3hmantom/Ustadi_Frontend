import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Globe, Lock, Pencil, Trash, Eye } from "lucide-react";

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

interface QuizCardProps {
  quiz: Quiz;
  currentUserId: number;
  onEdit: (quiz: Quiz) => void;
  onDelete: (quizId: number) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card 
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
        
        {quiz.student_id === currentUserId && (
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(quiz)}
            >
              <Pencil size={14} />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 hover:text-red-700"
              onClick={() => onDelete(quiz.quiz_id)}
            >
              <Trash size={14} />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuizCard;