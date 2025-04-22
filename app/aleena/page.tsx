'use client';

import React, { useState } from 'react';
import { dummyTasks, Task } from './dummyTasks';
import TaskCard from './TaskCard';

export default function TaskListPage() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'dueSoon' | 'high'>('all');

  const filteredTasks = dummyTasks.filter((task: Task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'dueSoon') return new Date(task.dueDate) <= new Date('2025-04-20');
    if (filter === 'high') return task.priority === 'high';
    return true;
  });

  return (
    <div className="p-8 bg-yellow-50 min-h-screen border-4 border-black font-mono">
      <h1 className="text-4xl font-extrabold underline text-black mb-6">📝 Task List</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <button onClick={() => setFilter('all')} className="bg-pink-400 text-black border-4 border-black px-4 py-2 hover:bg-pink-300">
          All
        </button>
        <button onClick={() => setFilter('completed')} className="bg-purple-400 text-black border-4 border-black px-4 py-2 hover:bg-purple-300">
          Completed
        </button>
        <button onClick={() => setFilter('dueSoon')} className="bg-blue-400 text-black border-4 border-black px-4 py-2 hover:bg-blue-300">
          Due Soon
        </button>
        <button onClick={() => setFilter('high')} className="bg-yellow-300 text-black border-4 border-black px-4 py-2 hover:bg-yellow-200">
          High Priority
        </button>
      </div>

      {filteredTasks.map((task: Task, index: number) => (
        <TaskCard key={task.id} task={task} />
      ))}

      {filteredTasks.length === 0 && (
        <p className="text-black bg-red-200 px-4 py-2 border-4 border-black mt-4">No tasks found for selected filter.</p>
      )}
    </div>
  );
}
