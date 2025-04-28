import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { LeaderboardFilter, LeaderboardUserExtended } from "../types";

interface LeaderboardTableProps {
  filter: LeaderboardFilter;
}

const LeaderboardTable = ({ filter }: LeaderboardTableProps) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUserExtended[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  
  // Fetch leaderboard data based on filters
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        params.append('period', filter.period);
        if (filter.category) {
          params.append('category', filter.category);
        }

        // Fetch data from API
        const response = await fetch(`/api/leaderboard?${params.toString()}`);
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setLeaderboardData(result.data);
          
          // Set current user's rank (for highlighting)
          // Assuming user ID 3 is the current user
          const currentUser = result.data.find((user: LeaderboardUserExtended) => user.userId === 3);
          if (currentUser) {
            setCurrentUserRank(currentUser.rank);
          }
        } else {
          console.error("Failed to fetch leaderboard data:", result.error);
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, [filter]);
  
  // Render loading state
  if (isLoading) {
    return (
      <Card className="border-2 border-black">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-60">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-2 border-black overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-black">
                <th className="py-3 px-4 text-left w-20">Rank</th>
                <th className="py-3 px-4 text-left">Student</th>
                <th className="py-3 px-4 text-right">Points</th>
                <th className="py-3 px-4 text-right">Weekly Change</th>
                <th className="py-3 px-4 text-center">Badges</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((user) => (
                <tr 
                  key={user.userId} 
                  className={`border-b border-gray-200 hover:bg-gray-50 
                    ${user.rank === currentUserRank ? "bg-yellow-50" : ""}`}
                >
                  <td className="py-3 px-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full 
                      ${user.rank <= 3 ? "bg-yellow-400 text-black font-bold border-2 border-black" : 
                        "bg-gray-100 border border-gray-300"}`}>
                      {user.rank <= 3 ? (
                        <Trophy size={16} className={user.rank === 1 ? "text-yellow-800" : ""} />
                      ) : user.rank}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center border-2 border-black">
                        <span className="font-bold">{user.avatar}</span>
                      </div>
                      <div>
                        <div className="font-bold">
                          {user.name}
                          {user.rank === currentUserRank && (
                            <span className="inline-flex ml-2 bg-black text-white px-2 py-0.5 rounded text-xs font-bold">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-bold">{user.points.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end items-center">
                      {user.weeklyChange !== undefined && (
                        <>
                          {user.weeklyChange > 0 ? (
                            <span className="flex items-center text-green-600">
                              <TrendingUp size={16} className="mr-1" />
                              +{user.weeklyChange}
                            </span>
                          ) : user.weeklyChange < 0 ? (
                            <span className="flex items-center text-red-600">
                              <TrendingDown size={16} className="mr-1" />
                              {user.weeklyChange}
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-1">
                      {user.badges?.map((badge, index) => (
                        <span 
                          key={index}
                          className="inline-block w-6 h-6 rounded-full bg-purple-100 border border-purple-300"
                          title={badge}
                        >
                          {badge.substring(0, 1)}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;