'use client';
export type Task = {
    id: string; // <-- string, not number
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    tags: string[];
    completed: boolean;
  };
  
  export const dummyTasks: Task[] = [
    {
      id: "1", // <-- string
      title: "Finish project",
      description: "Complete the project module",
      priority: "high",
      dueDate: "2025-04-20",
      tags: ["work", "urgent"],
      completed: false,
    },
    {
      id: "2", // <-- string
      title: "Buy groceries",
      description: "Milk, Bread, Eggs",
      priority: "Low",
      dueDate: "2025-04-16",
      tags: ["personal"],
      completed: true,
    },
  ];
  