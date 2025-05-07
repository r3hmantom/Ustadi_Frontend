import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivitySummary } from "@/app/services/analyticsService";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Loader } from "@/components/ui/loader";

interface ActivitySummaryCardProps {
  data: ActivitySummary;
  isLoading?: boolean;
}

export default function ActivitySummaryCard({
  data,
  isLoading,
}: ActivitySummaryCardProps) {
  const taskCompletionRate = data?.task_completion_rate || 0;
  const completionPercentage = Math.round(taskCompletionRate * 100);

  if (isLoading) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader size="small" text="Loading activity data..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Activity Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row justify-around items-center gap-4">
        <div className="flex flex-col items-center">
          <div className="text-sm text-muted-foreground mb-1">Total Points</div>
          <div className="text-3xl font-bold">
            {data?.total_points || 0}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-sm text-muted-foreground mb-1">Activities</div>
          <div className="text-3xl font-bold">
            {data?.activities_completed || 0}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-sm text-muted-foreground mb-1">
            Task Completion
          </div>
          <div className="w-20 h-20">
            <CircularProgressbar
              value={completionPercentage}
              text={`${completionPercentage}%`}
              styles={buildStyles({
                textSize: "24px",
                pathColor: `rgba(62, 152, 199, ${completionPercentage / 100})`,
                textColor: "#3e98c7",
                trailColor: "#d6d6d6",
              })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
