import { useState, useEffect } from "react";
import { Question } from "@/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, ChevronLeftIcon, CheckIcon } from "lucide-react";

interface AttemptQuestionProps {
  question: Question;
  onAnswer: (selectedOption: "a" | "b" | "c" | "d") => Promise<void>;
  onNext?: () => void;
  onPrevious?: () => void;
  selectedOption?: string;
  isLast?: boolean;
  isFirst?: boolean;
  questionNumber: number;
  totalQuestions: number;
  isSubmitting?: boolean;
}

export default function AttemptQuestion({
  question,
  onAnswer,
  onNext,
  onPrevious,
  selectedOption,
  isLast = false,
  isFirst = false,
  questionNumber,
  totalQuestions,
  isSubmitting = false,
}: AttemptQuestionProps) {
  const [selected, setSelected] = useState<"a" | "b" | "c" | "d" | undefined>(
    selectedOption as "a" | "b" | "c" | "d" | undefined
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    setSelected(selectedOption as "a" | "b" | "c" | "d" | undefined);
  }, [selectedOption, question.question_id]);

  const handleChange = async (value: string) => {
    const option = value as "a" | "b" | "c" | "d";
    setSelected(option);
    setSaveStatus("saving");
    
    try {
      await onAnswer(option);
      setSaveStatus("saved");
      
      // Reset the saved status after a delay
      setTimeout(() => {
        setSaveStatus("idle");
      }, 1500);
    } catch (error) {
      console.error("Failed to save answer:", error);
      setSaveStatus("idle");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>
            Question {questionNumber} of {totalQuestions}
          </span>
          {saveStatus === "saving" && (
            <span className="text-sm font-normal text-muted-foreground">
              Saving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-sm font-normal text-green-500 flex items-center gap-1">
              <CheckIcon className="h-4 w-4" /> Saved
            </span>
          )}
        </CardTitle>
        <p className="text-lg font-medium">{question.content}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={selected}
          onValueChange={handleChange}
          className="space-y-3"
          disabled={isSubmitting}
        >
          {[
            { key: "a", label: "A", value: question.option_a },
            { key: "b", label: "B", value: question.option_b },
            { key: "c", label: "C", value: question.option_c },
            { key: "d", label: "D", value: question.option_d },
          ].map((option) => (
            <div key={option.key} className="flex items-start space-x-2">
              <RadioGroupItem
                value={option.key}
                id={`option-${question.question_id}-${option.key}`}
                disabled={isSubmitting}
              />
              <Label
                htmlFor={`option-${question.question_id}-${option.key}`}
                className="font-normal cursor-pointer"
              >
                <span className="font-medium mr-2">{option.label}.</span>
                {option.value}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between pt-4">
          <Button
            onClick={onPrevious}
            variant="outline"
            type="button"
            disabled={isFirst || isSubmitting}
            className={isFirst ? "invisible" : ""}
          >
            <ChevronLeftIcon className="h-4 w-4 mr-2" /> Previous
          </Button>
          <Button
            onClick={onNext}
            type="button"
            disabled={isSubmitting}
            className={isLast ? "invisible" : ""}
          >
            Next <ChevronRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}