import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, CheckCircle, Clock, Award, BookOpen } from "lucide-react";

const PointsBreakdown = () => {
  // Point earning activities
  const pointActivities = [
    { 
      activity: "Complete a Task", 
      points: 10,
      icon: <CheckCircle className="text-green-500" size={18} />,
      description: "Earn points by completing your scheduled tasks"
    },
    { 
      activity: "Study Session", 
      points: 5,
      icon: <Clock className="text-blue-500" size={18} />,
      description: "Per 30 minutes of focused study time"
    },
    { 
      activity: "Perfect Quiz Score", 
      points: 25,
      icon: <Award className="text-purple-500" size={18} />,
      description: "Get all answers correct on a quiz"
    },
    { 
      activity: "Daily Revision", 
      points: 15,
      icon: <BookOpen className="text-orange-500" size={18} />,
      description: "Complete your daily revision cards"
    }
  ];

  return (
    <Card className="border-2 border-black">
      <CardHeader className="border-b border-black bg-gray-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <HelpCircle size={20} />
          How to Earn Points
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-3">
          {pointActivities.map((item, index) => (
            <li key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md">
              <div className="mt-0.5">{item.icon}</div>
              <div>
                <div className="flex items-center">
                  <span className="font-bold">{item.activity}</span>
                  <span className="ml-2 bg-black text-white px-2 py-0.5 rounded text-xs">
                    {item.points} pts
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded-md border border-yellow-200 text-sm">
          <p className="font-bold mb-1">Special Rewards</p>
          <p className="text-gray-700">
            Weekly top 3 students receive bonus points and monthly winners are featured on the school homepage!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsBreakdown;