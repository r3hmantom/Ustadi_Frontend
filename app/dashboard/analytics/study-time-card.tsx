import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudyTimeData } from "@/app/services/analyticsService";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Loader } from "@/components/ui/loader";

interface StudyTimeCardProps {
  data: StudyTimeData;
  isLoading?: boolean;
}

export default function StudyTimeCard({ data, isLoading }: StudyTimeCardProps) {
  // Colors for different session types
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  // Format the data for the pie chart
  const chartData =
    data?.by_type?.map((item) => ({
      name: formatSessionType(item.type),
      value: item.minutes,
    })) || [];

  function formatSessionType(type: string): string {
    return type.replace(/([A-Z])/g, " $1").trim();
  }

  function formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Study Time</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader size="small" text="Loading study data..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Study Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">Total Time</div>
              <div className="text-2xl font-bold">
                {formatTime(data?.total_minutes || 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Sessions</div>
              <div className="text-2xl font-bold">
                {data?.session_count || 0}
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-muted-foreground">
                Average Session
              </div>
              <div className="text-2xl font-bold">
                {formatTime(data?.average_duration || 0)}
              </div>
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="h-[200px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={(entry) => entry.name}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatTime(value as number)}
                    labelFormatter={(label) => `Type: ${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              No study session data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
