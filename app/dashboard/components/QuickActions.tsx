import React from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, Users, ArrowUpRight } from "lucide-react";

export function QuickActions() {
  return (
    <Card className="bg-white">
      <CardHeader className="border-b-4 border-black">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-4">
          <Button variant="neuPrimary" className="w-full justify-start gap-2">
            <PlusCircle size={18} /> Create New Task
          </Button>
          <Button variant="neuSecondary" className="w-full justify-start gap-2">
            <BookOpen size={18} /> Start a Quiz
          </Button>
          <Button variant="neubrutalism" className="w-full justify-start gap-2">
            <Users size={18} /> Join Group Study
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
            <ArrowUpRight size={18} /> Share Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}