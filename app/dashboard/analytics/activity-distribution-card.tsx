import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityDistribution } from "@/app/services/analyticsService";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ActivityDistributionCardProps {
  data: ActivityDistribution[];
  isLoading?: boolean;
}

export default function ActivityDistributionCard({
  data,
  isLoading,
}: ActivityDistributionCardProps) {
  // Format the data for the chart
  const chartData =
    data?.map((item) => ({
      name: formatActivityType(item.activity_type),
      count: item.count,
      points: item.points,
    })) || [];

  function formatActivityType(type: string): string {
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Activity Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            Loading activity data...
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  value,
                  name === "count" ? "Activities" : "Points",
                ]}
                labelFormatter={(label) => `Activity: ${label}`}
              />
              <Bar dataKey="count" name="Activities" fill="#8884d8" />
              <Bar dataKey="points" name="Points" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            No activity data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
