import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizPerformance } from "@/app/services/analyticsService";
import { Progress } from "@/components/ui/progress";
import { Loader } from "@/components/ui/loader";

interface QuizPerformanceCardProps {
  data: QuizPerformance;
  isLoading?: boolean;
}

export default function QuizPerformanceCard({
  data,
  isLoading,
}: QuizPerformanceCardProps) {
  const averageScore = Math.round(data?.average_score || 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Performance</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader size="small" text="Loading quiz data..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Quiz Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Average Score</div>
          <div className="flex items-center gap-2">
            <Progress value={averageScore} className="h-2" />
            <span className="text-sm font-medium">{averageScore}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">
              Total Attempts
            </div>
            <div className="text-2xl font-bold">
              {data?.total_attempts || 0}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="text-2xl font-bold">
              {data?.quizzes_completed || 0}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="text-sm text-muted-foreground mb-1">
            Performance Rating
          </div>
          <div className="text-lg font-medium">
            {averageScore >= 90
              ? "Excellent"
              : averageScore >= 75
                ? "Good"
                : averageScore >= 60
                  ? "Average"
                  : averageScore > 0
                    ? "Needs Improvement"
                    : "No Data"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
