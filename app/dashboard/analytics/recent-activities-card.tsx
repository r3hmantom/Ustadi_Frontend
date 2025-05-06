import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Activity, Clock, Award } from "lucide-react";

interface RecentActivity {
  activity_type: string;
  activity_date: string;
  points_earned: number;
  description: string;
}

interface RecentActivitiesCardProps {
  data: RecentActivity[];
  isLoading?: boolean;
}

export default function RecentActivitiesCard({
  data,
  isLoading,
}: RecentActivitiesCardProps) {
  // Helper to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task_completion":
        return <Activity className="h-4 w-4" />;
      case "quiz_completion":
        return <Award className="h-4 w-4" />;
      case "study_session":
        return <Clock className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  // Format activity type for display
  const formatActivityType = (type: string): string => {
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            Loading activities...
          </div>
        ) : data && data.length > 0 ? (
          <div className="space-y-4">
            {data.map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b pb-3 last:border-b-0 last:pb-0"
              >
                <div className="bg-primary/10 p-2 rounded-full">
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    {formatActivityType(activity.activity_type)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description || "Activity completed"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    +{activity.points_earned} pts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.activity_date), "MMM d, h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            No recent activities found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
