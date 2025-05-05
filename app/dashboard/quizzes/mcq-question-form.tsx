import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { McqQuestionFormData } from "@/app/services/quizService";

interface McqQuestionFormProps {
  onSubmit: (questionData: McqQuestionFormData) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<McqQuestionFormData>;
}

export default function McqQuestionForm({
  onSubmit,
  isLoading = false,
  initialData = {},
}: McqQuestionFormProps) {
  const [formData, setFormData] = useState<McqQuestionFormData>({
    content: initialData.content || "",
    option_a: initialData.option_a || "",
    option_b: initialData.option_b || "",
    option_c: initialData.option_c || "",
    option_d: initialData.option_d || "",
    correct_answer: initialData.correct_answer || "a",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      correct_answer: value as "a" | "b" | "c" | "d",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);

    // Clear the form if no initialData was provided (for adding new questions)
    if (!initialData.content) {
      setFormData({
        content: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "a",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">Question</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Enter your question here"
          value={formData.content}
          onChange={handleChange}
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="space-y-4">
        <Label>Answer Options</Label>
        <Card>
          <CardContent className="pt-6">
            <RadioGroup
              value={formData.correct_answer}
              onValueChange={handleRadioChange}
              className="space-y-4"
            >
              {["a", "b", "c", "d"].map((option) => (
                <div key={option} className="flex items-center space-x-3">
                  <RadioGroupItem value={option} id={`option-${option}`} />
                  <Input
                    id={`option_${option}`}
                    name={`option_${option}`}
                    placeholder={`Option ${option.toUpperCase()}`}
                    value={
                      formData[
                        `option_${option}` as keyof McqQuestionFormData
                      ] as string
                    }
                    onChange={handleChange}
                    className="flex-1"
                    required
                  />
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        <p className="text-sm text-muted-foreground">
          Select the radio button next to the correct answer.
        </p>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading
          ? "Saving..."
          : initialData.content
            ? "Update Question"
            : "Add Question"}
      </Button>
    </form>
  );
}
