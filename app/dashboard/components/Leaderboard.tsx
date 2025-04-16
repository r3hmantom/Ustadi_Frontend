import React from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { LeaderboardUser } from "../types";

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserName: string;
}

export function Leaderboard({ users, currentUserName }: LeaderboardProps) {
  return (
    <Card className="bg-[#FFD600] mt-6">
      <CardHeader className="border-b-4 border-black">
        <CardTitle className="flex items-center gap-2">
          <Trophy size={20} /> Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-4">
          {users.map((user) => (
            <li 
              key={user.rank} 
              className={`flex items-center p-3 rounded-md border-3 ${
                user.rank <= 3 ? "border-black bg-white" : "border-black/50 bg-gray-50"
              } ${user.name === currentUserName ? "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" : ""}`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 border-2 border-black font-bold">
                {user.rank}
              </div>
              <div className="flex-1 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center mr-3 border-2 border-black">
                  <span className="font-bold">{user.avatar}</span>
                </div>
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm">{user.points} points</p>
                </div>
              </div>
              {user.name === currentUserName && (
                <span className="inline-flex bg-black text-white px-2 py-1 rounded text-xs font-bold">
                  You
                </span>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="border-t border-black">
        <Button variant="ghost" className="w-full font-bold">Full Leaderboard</Button>
      </CardFooter>
    </Card>
  );
}