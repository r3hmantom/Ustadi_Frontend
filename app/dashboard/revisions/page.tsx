"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Flashcard } from "@/db/types";
import { useUser } from "@/lib/hooks/useUser";
import {
  createFlashcard,
  deleteFlashcard,
  fetchFlashcards,
  updateFlashcard,
  FlashcardFormData,
} from "@/app/services/flashcardService";
import FlashcardCard from "./flashcard-card";
import FlashcardDialog from "./flashcard-dialog";
import PracticeDialog from "./practice-dialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

const RevisionsPage = () => {
  const { user } = useUser();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [practiceDialogOpen, setPracticeDialogOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("all");

  // Fetch flashcards on component mount
  useEffect(() => {
    const loadFlashcards = async () => {
      if (user?.studentId) {
        try {
          setIsLoading(true);
          const data = await fetchFlashcards(user.studentId);
          setFlashcards(data);
        } catch (error) {
          console.error("Failed to load flashcards:", error);
          toast.error("Failed to load flashcards");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadFlashcards();
  }, [user?.studentId]);

  // Handle flashcard creation
  const handleCreateFlashcard = async (data: FlashcardFormData) => {
    if (!user?.studentId) {
      toast.error("You must be logged in to create flashcards");
      return;
    }

    try {
      const newFlashcard = await createFlashcard({
        ...data,
        student_id: user.studentId,
      });

      setFlashcards((prevCards) => [newFlashcard, ...prevCards]);
      toast.success("Flashcard created successfully");
    } catch (error) {
      console.error("Failed to create flashcard:", error);
      toast.error("Failed to create flashcard");
      throw error; // Re-throw to be handled by the dialog
    }
  };

  // Handle flashcard update
  const handleUpdateFlashcard = async (data: FlashcardFormData) => {
    if (!selectedFlashcard) return;

    try {
      const updatedFlashcard = await updateFlashcard(
        selectedFlashcard.flashcard_id,
        data
      );

      setFlashcards((prevCards) =>
        prevCards.map((card) =>
          card.flashcard_id === updatedFlashcard.flashcard_id
            ? updatedFlashcard
            : card
        )
      );

      toast.success("Flashcard updated successfully");
    } catch (error) {
      console.error("Failed to update flashcard:", error);
      toast.error("Failed to update flashcard");
      throw error;
    }
  };

  // Handle flashcard deletion
  const handleDeleteFlashcard = async (flashcard: Flashcard) => {
    try {
      await deleteFlashcard(flashcard.flashcard_id);

      setFlashcards((prevCards) =>
        prevCards.filter((card) => card.flashcard_id !== flashcard.flashcard_id)
      );

      toast.success("Flashcard deleted successfully");
    } catch (error) {
      console.error("Failed to delete flashcard:", error);
      toast.error("Failed to delete flashcard");
    }
  };

  // Open edit dialog
  const handleEditFlashcard = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard);
    setEditDialogOpen(true);
  };

  // Open practice dialog
  const handlePracticeFlashcard = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard);
    setPracticeDialogOpen(true);
  };

  // Handle practice completion (update flashcard in the list)
  const handlePracticeComplete = (updatedFlashcard: Flashcard) => {
    setFlashcards((prevCards) =>
      prevCards.map((card) =>
        card.flashcard_id === updatedFlashcard.flashcard_id
          ? updatedFlashcard
          : card
      )
    );
  };

  // Filter flashcards based on active tab
  const filteredFlashcards = () => {
    const now = new Date();

    if (activeTab === "due") {
      return flashcards.filter(
        (flashcard) => new Date(flashcard.next_review_date) <= now
      );
    }

    if (activeTab === "later") {
      return flashcards.filter(
        (flashcard) => new Date(flashcard.next_review_date) > now
      );
    }

    return flashcards;
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
          <p className="text-muted-foreground">
            Create and practice flashcards to improve retention and recall
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="w-fit">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Flashcard
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Flashcards</TabsTrigger>
          <TabsTrigger value="due">Due Today</TabsTrigger>
          <TabsTrigger value="later">Coming Later</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Flashcards</CardTitle>
              <CardDescription>
                All your flashcards sorted by next review date
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading flashcards...</div>
              ) : filteredFlashcards().length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No flashcards found
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    Create your first flashcard
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredFlashcards().map((flashcard) => (
                    <FlashcardCard
                      key={flashcard.flashcard_id}
                      flashcard={flashcard}
                      onEdit={handleEditFlashcard}
                      onDelete={handleDeleteFlashcard}
                      onPractice={handlePracticeFlashcard}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="due" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Due Today</CardTitle>
              <CardDescription>
                Flashcards that are due for review today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading flashcards...</div>
              ) : filteredFlashcards().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No flashcards due for review today
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredFlashcards().map((flashcard) => (
                    <FlashcardCard
                      key={flashcard.flashcard_id}
                      flashcard={flashcard}
                      onEdit={handleEditFlashcard}
                      onDelete={handleDeleteFlashcard}
                      onPractice={handlePracticeFlashcard}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="later" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Coming Later</CardTitle>
              <CardDescription>
                Flashcards scheduled for review in the future
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading flashcards...</div>
              ) : filteredFlashcards().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No flashcards scheduled for future review
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredFlashcards().map((flashcard) => (
                    <FlashcardCard
                      key={flashcard.flashcard_id}
                      flashcard={flashcard}
                      onEdit={handleEditFlashcard}
                      onDelete={handleDeleteFlashcard}
                      onPractice={handlePracticeFlashcard}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Flashcard Dialog */}
      <FlashcardDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSave={handleCreateFlashcard}
        title="Create Flashcard"
      />

      {/* Edit Flashcard Dialog */}
      {selectedFlashcard && (
        <FlashcardDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleUpdateFlashcard}
          flashcard={selectedFlashcard}
          title="Edit Flashcard"
        />
      )}

      {/* Practice Flashcard Dialog */}
      {selectedFlashcard && (
        <PracticeDialog
          open={practiceDialogOpen}
          onOpenChange={setPracticeDialogOpen}
          flashcard={selectedFlashcard}
          onComplete={handlePracticeComplete}
        />
      )}
    </div>
  );
};

export default RevisionsPage;
