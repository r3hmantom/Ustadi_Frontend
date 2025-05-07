"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/hooks/useUser";
import { useFlashcard } from "@/lib/hooks/useFlashcard";
import { useAsyncAction } from "@/lib/hooks/useAsyncAction";
import FlashcardCard from "./flashcard-card";
import FlashcardDialog from "./flashcard-dialog";
import PracticeDialog from "./practice-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, AlertCircle } from "lucide-react";
import { Loader } from "@/components/ui/loader";

const RevisionsPage = () => {
  const { user } = useUser();
  const {
    flashcards,
    isLoading,
    error,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
  } = useFlashcard();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [practiceDialogOpen, setPracticeDialogOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Create flashcard action
  const {
    execute: handleCreate,
    isLoading: isCreating,
    error: createError,
  } = useAsyncAction(
    async (data) => {
      await createFlashcard(data);
      setCreateDialogOpen(false);
    },
    {
      successMessage: "Flashcard created successfully",
      errorMessage: "Failed to create flashcard",
    }
  );

  // Update flashcard action
  const {
    execute: handleUpdate,
    isLoading: isUpdating,
    error: updateError,
  } = useAsyncAction(
    async (data) => {
      if (!selectedFlashcard) return;
      await updateFlashcard(selectedFlashcard.id, data);
      setEditDialogOpen(false);
    },
    {
      successMessage: "Flashcard updated successfully",
      errorMessage: "Failed to update flashcard",
    }
  );

  // Delete flashcard action
  const {
    execute: handleDelete,
    isLoading: isDeleting,
    error: deleteError,
  } = useAsyncAction(
    async (flashcard) => {
      await deleteFlashcard(flashcard.id);
    },
    {
      successMessage: "Flashcard deleted successfully",
      errorMessage: "Failed to delete flashcard",
    }
  );

  // Open edit dialog
  const handleEditFlashcard = (flashcard) => {
    setSelectedFlashcard(flashcard);
    setEditDialogOpen(true);
  };

  // Open practice dialog
  const handlePracticeFlashcard = (flashcard) => {
    setSelectedFlashcard(flashcard);
    setPracticeDialogOpen(true);
  };

  // Handle practice completion (update flashcard in the list)
  const handlePracticeComplete = (updatedFlashcard) => {
    handleUpdate({
      ...updatedFlashcard,
      last_reviewed_at: new Date().toISOString(),
    });
  };

  // Filter flashcards based on active tab
  const getFilteredFlashcards = () => {
    const now = new Date();

    if (activeTab === "due") {
      return flashcards.filter(
        (flashcard) =>
          flashcard.next_review_date &&
          new Date(flashcard.next_review_date) <= now
      );
    }

    if (activeTab === "later") {
      return flashcards.filter(
        (flashcard) =>
          flashcard.next_review_date &&
          new Date(flashcard.next_review_date) > now
      );
    }

    return flashcards;
  };

  const filteredFlashcards = getFilteredFlashcards();

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

      {(error || createError || updateError || deleteError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || createError || updateError || deleteError}
          </AlertDescription>
        </Alert>
      )}

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
                <div className="text-center py-8">
                  <Loader size="small" text="Loading flashcards..." />
                </div>
              ) : filteredFlashcards.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No flashcards found. Create your first flashcard to get
                    started!
                  </p>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Flashcard
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFlashcards.map((flashcard) => (
                    <FlashcardCard
                      key={flashcard.id}
                      flashcard={flashcard}
                      onEdit={handleEditFlashcard}
                      onDelete={handleDelete}
                      onPractice={handlePracticeFlashcard}
                      isDeleting={isDeleting}
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
                <div className="text-center py-8">
                  <Loader size="small" text="Loading flashcards..." />
                </div>
              ) : filteredFlashcards.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No flashcards due for review today.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFlashcards.map((flashcard) => (
                    <FlashcardCard
                      key={flashcard.id}
                      flashcard={flashcard}
                      onEdit={handleEditFlashcard}
                      onDelete={handleDelete}
                      onPractice={handlePracticeFlashcard}
                      isDeleting={isDeleting}
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
                <div className="text-center py-8">
                  <Loader size="small" text="Loading flashcards..." />
                </div>
              ) : filteredFlashcards.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No flashcards scheduled for future review.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFlashcards.map((flashcard) => (
                    <FlashcardCard
                      key={flashcard.id}
                      flashcard={flashcard}
                      onEdit={handleEditFlashcard}
                      onDelete={handleDelete}
                      onPractice={handlePracticeFlashcard}
                      isDeleting={isDeleting}
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
        onSubmit={handleCreate}
        isSubmitting={isCreating}
        title="Create Flashcard"
      />

      {/* Edit Flashcard Dialog */}
      <FlashcardDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleUpdate}
        flashcard={selectedFlashcard}
        isSubmitting={isUpdating}
        title="Edit Flashcard"
      />

      {/* Practice Flashcard Dialog */}
      <PracticeDialog
        open={practiceDialogOpen}
        onOpenChange={setPracticeDialogOpen}
        flashcard={selectedFlashcard}
        onComplete={handlePracticeComplete}
      />
    </div>
  );
};

export default RevisionsPage;
