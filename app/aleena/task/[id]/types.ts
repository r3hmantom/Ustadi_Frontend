// app/aleena/task/[id]/types.ts
export interface Comment {
    id: string;
    taskId: string;
    author: string;
    text: string;
    parentId: string | null;
    createdAt: string;
  }
  