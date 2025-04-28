import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";

const TopAchievers = () => {
  // Dummy data for top achievers
  const topAchievers = [
    {
      id: 1,
      name: "Sarah K.",
      avatar: "SK",
      title: "This Month's Champion",
      achievement: "4,250 points",
      background: "bg-gradient-to-r from-yellow-300 to-yellow-500"
    },
    {
      id: 2,
      name: "Michael T.",
      avatar: "MT",
      title: "Most Consistent",
      achievement: "30-day streak",
      background: "bg-gradient-to-r from-blue-300 to-blue-500"
    },
    {
      id: 3,
      name: "Lisa W.",
      avatar: "LW",
      title: "Most Improved",
      achievement: "+200 points this week",
      background: "bg-gradient-to-r from-green-300 to-green-500"
    }
  ];

  return (
    <Card className="border-2 border-black">
      <CardHeader className="border-b border-black bg-gray-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <Crown className="text-yellow-500" size={20} />
          Top Achievers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {topAchievers.map((achiever) => (
            <div 
              key={achiever.id}
              className={`${achiever.background} text-white rounded-lg p-4 shadow-md border-2 border-black`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-black">
                  <span className="font-bold text-black">{achiever.avatar}</span>
                </div>
                <div>
                  <div className="font-bold text-lg">{achiever.name}</div>
                  <div className="text-sm opacity-90">{achiever.title}</div>
                  <div className="text-sm font-bold mt-1">{achiever.achievement}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopAchievers;