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
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FlashcardSectionProps {
  flashcards: Flashcard[];
}

export function FlashcardSection({ flashcards }: FlashcardSectionProps) {
  const router = useRouter();

  // Function to navigate to revisions page
  const goToRevisions = () => {
    router.push("/dashboard/revisions");
  };

  // Function to navigate to revisions page with create modal open
  // This is a placeholder since we can't directly control modal state across routes
  const createNewFlashcard = () => {
    router.push("/dashboard/revisions");
  };

  return (
    <Card className="bg-white">
      <CardHeader className="border-b-4 border-black">
        <CardTitle className="flex items-center gap-2">
          <Brain size={20} /> Flashcards
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {flashcards.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No flashcards available</p>
            <p className="text-sm">Create some in the revisions section</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flashcards.map((card) => (
              <div 
                key={card.id} 
                className="border-3 border-black p-3 rounded-md bg-pink-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
                onClick={goToRevisions}
              >
                <p className="font-bold text-sm mb-1">{card.subject}</p>
                <p className="font-medium">{card.front}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-200 flex justify-between">
        <Button variant="ghost" className="font-bold" onClick={goToRevisions}>
          Study Now
        </Button>
        <Button variant="neuPrimary" size="sm" onClick={createNewFlashcard}>
          <PlusCircle size={16} className="mr-1" /> Create
        </Button>
      </CardFooter>
    </Card>
  );
}