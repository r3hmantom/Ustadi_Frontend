import React from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, PlusCircle } from "lucide-react";
import { Flashcard } from "../types";

interface FlashcardSectionProps {
  flashcards: Flashcard[];
}

export function FlashcardSection({ flashcards }: FlashcardSectionProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="border-b-4 border-black">
        <CardTitle className="flex items-center gap-2">
          <Brain size={20} /> Flashcards
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {flashcards.map((card) => (
            <div 
              key={card.id} 
              className="border-3 border-black p-3 rounded-md bg-pink-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
            >
              <p className="font-bold text-sm mb-1">{card.subject}</p>
              <p className="font-medium">{card.front}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-200 flex justify-between">
        <Button variant="ghost" className="font-bold">Study Now</Button>
        <Button variant="neuPrimary" size="sm">
          <PlusCircle size={16} className="mr-1" /> Create
        </Button>
      </CardFooter>
    </Card>
  );
}