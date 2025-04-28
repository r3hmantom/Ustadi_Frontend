import React from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { StudySession } from "../types";

interface StudySessionsProps {
  sessions: StudySession[];
}

export function StudySessions({ sessions }: StudySessionsProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="border-b-4 border-black">
        <CardTitle className="flex items-center gap-2">
          <Clock size={20} /> Recent Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="divide-y">
          {sessions.map((session, index) => (
            <li key={index} className="py-3 flex justify-between">
              <div>
                <p className="font-bold">{session.subject}</p>
                <p className="text-sm text-gray-500">{session.date}</p>
              </div>
              <span className="font-mono font-bold">{session.duration}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="border-t border-gray-200">
        <Button variant="ghost" className="w-full font-bold">View All Sessions</Button>
      </CardFooter>
    </Card>
  );
}