'use client';

import { useParams } from 'next/navigation';
import CommentSection from './commentSection';
import { dummyTasks, Task } from '@/app/aleena/dummyTasks';

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = params.id as string;

  const task = dummyTasks.find((t: Task) => t.id === taskId);

  if (!task) {
    return (
      <div className="p-6 m-6 text-xl font-bold text-red-700 bg-red-100 border-4 border-black">
        🚫 Task not found.
      </div>
    );
  }

  return (
    <div className="p-8 m-6 border-4 border-black bg-yellow-50 font-mono">
      <h1 className="text-4xl font-extrabold underline text-blue-800 mb-4">{task.title}</h1>

      <p className="text-gray-800 mb-3">{task.description}</p>

      <p className="mb-2">
        <strong className="bg-black text-white px-2">Priority:</strong>{' '}
        <span className="uppercase font-bold">{task.priority}</span>
      </p>

      <p className="mb-2">
        <strong className="bg-black text-white px-2">Due Date:</strong>{' '}
        <span className="text-blue-700">{task.dueDate}</span>
      </p>

      <p className="mb-2">
        <strong className="bg-black text-white px-2">Tags:</strong>{' '}
        <span className="bg-blue-100 border border-black px-2 py-1">{task.tags.join(', ')}</span>
      </p>

      <p className={`text-xl font-bold mt-4 ${task.completed ? 'text-green-600' : 'text-red-600'}`}>
        {task.completed ? '✅ Completed' : '⏳ Pending'}
      </p>

      <div className="mt-6 border-t-4 border-black pt-4">
        <CommentSection taskId={taskId} />
      </div>
    </div>
  );
}
