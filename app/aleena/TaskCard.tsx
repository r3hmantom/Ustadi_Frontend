'use client';

import Link from 'next/link';
import { Task } from './dummyTasks';

interface Props {
  task?: Task;
}

export default function TaskCard({ task }: Props) {
  if (!task) return null;

  return (
    <Link href={`/aleena/task/${task.id}`}>
      <div className="border-4 border-black bg-white p-6 mb-6 cursor-pointer transition-all hover:translate-x-1 hover:-translate-y-1">
        <h2 className="text-2xl font-extrabold text-blue-800 underline mb-2">{task.title}</h2>
        <p className="text-gray-800 mb-1">{task.description}</p>
        <p className="font-bold mb-1">Priority: <span className="uppercase">{task.priority}</span></p>
        <p className="text-sm mb-1">
          <span className="bg-black text-yellow-300 px-2 py-1 font-mono">{task.tags.join(', ')}</span>
        </p>
        <p className={`font-bold ${task.completed ? 'text-green-600' : 'text-red-600'}`}>
          {task.completed ? '✅ Completed' : '⏳ Pending'}
        </p>
      </div>
    </Link>
  );
}
