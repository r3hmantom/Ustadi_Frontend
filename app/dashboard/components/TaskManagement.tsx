import React from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { 
  Circle, 
  CheckCircle, 
  PlusCircle, 
  CalendarDays,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { StaggerItem } from "@/components/ui/animated-elements";
import { Task } from "../types";

interface TaskManagementProps {
  upcomingTasks: Task[];
  completedTasks: Task[];
}

export function TaskManagement({ upcomingTasks, completedTasks }: TaskManagementProps) {
  const renderPriorityBadge = (priority: string) => {
    switch(priority) {
      case "High":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-md border-2 border-red-700 text-xs font-bold">
            <ArrowUp size={12} /> {priority}
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md border-2 border-yellow-700 text-xs font-bold">
            {priority}
          </span>
        );
      case "Low":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md border-2 border-blue-700 text-xs font-bold">
            <ArrowDown size={12} /> {priority}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md border-2 border-gray-700 text-xs font-bold">
            {priority}
          </span>
        );
    }
  };

  return (
    <StaggerItem className="lg:col-span-2">
      <Card className="bg-white">
        <CardHeader className="border-b-4 border-black">
          <div className="flex items-center justify-between">
            <CardTitle>Task Management</CardTitle>
            <Button variant="neuPrimary" size="sm" className="gap-1">
              <PlusCircle size={16} /> New Task
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="upcoming">
                {upcomingTasks.length > 0 ? (
                  <ul className="space-y-4">
                    {upcomingTasks.map(task => (
                      <li key={task.id} className="flex items-center p-3 rounded-md border-3 border-black bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <div className="mr-3">
                          {task.completed ? (
                            <CheckCircle size={20} className="text-green-500" />
                          ) : (
                            <Circle size={20} className="text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold">{task.title}</p>
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <CalendarDays size={14} className="text-gray-500" />
                            <span className="text-gray-500">Due: {task.dueDate}</span>
                            {renderPriorityBadge(task.priority)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No upcoming tasks</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="completed">
                {completedTasks.length > 0 ? (
                  <ul className="space-y-4">
                    {completedTasks.map(task => (
                      <li key={task.id} className="flex items-center p-3 rounded-md border-3 border-black bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <div className="mr-3">
                          <CheckCircle size={20} className="text-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold line-through opacity-70">{task.title}</p>
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <CalendarDays size={14} className="text-gray-500" />
                            <span className="text-gray-500">Was due: {task.dueDate}</span>
                            {renderPriorityBadge(task.priority)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No completed tasks yet</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t border-gray-200">
          <Button variant="ghost" className="w-full font-bold">View All Tasks</Button>
        </CardFooter>
      </Card>
    </StaggerItem>
  );
}