import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Clock, CheckCircle2, LineChart } from "lucide-react";

interface FlashcardStatsProps {
  totalCards: number;
  dueCards: number;
}

const FlashcardStats: React.FC<FlashcardStatsProps> = ({ totalCards, dueCards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-white">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <BrainCircuit className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Flashcards</p>
            <p className="text-2xl font-bold">{totalCards}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className={`${dueCards > 0 ? 'bg-orange-50' : 'bg-white'}`}>
        <CardContent className="p-6 flex items-center gap-4">
          <div className={`${dueCards > 0 ? 'bg-orange-100' : 'bg-blue-100'} p-3 rounded-full`}>
            <Clock className={`${dueCards > 0 ? 'text-orange-600' : 'text-blue-600'}`} size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Due for Review</p>
            <p className="text-2xl font-bold">{dueCards}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <LineChart className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Review Streak</p>
            <p className="text-2xl font-bold">3 days</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlashcardStats;