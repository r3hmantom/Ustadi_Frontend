'use client';

import { useState } from 'react';
import { Comment } from './types';

interface Props {
  taskId: string;
}

const initialComments: Comment[] = [
  {
    id: 'c1',
    taskId: '1',
    author: 'Aleena',
    text: 'Great job!',
    parentId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c2',
    taskId: '1',
    author: 'lsiha',
    text: 'Thanksyou Aleena!',
    parentId: 'c1',
    createdAt: new Date().toISOString(),
  },
];

export default function CommentSection({ taskId }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const addComment = () => {
    if (!newComment.trim()) return;
    const newEntry: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      taskId,
      author: 'You',
      text: newComment,
      parentId: replyTo,
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, newEntry]);
    setNewComment('');
    setReplyTo(null);
  };

  const renderComments = (parentId: string | null) =>
    comments
      .filter(c => c.parentId === parentId && c.taskId === taskId)
      .map(c => (
        <div
          key={c.id}
          className="ml-4 mt-3 border-l-4 border-black pl-4 bg-white shadow-md p-2 rounded"
        >
          <p className="text-sm font-mono">
            <strong className="bg-yellow-300 px-1">{c.author}</strong>: {c.text}
          </p>
          <button
            onClick={() => setReplyTo(c.id)}
            className="text-xs text-blue-700 underline mt-1 hover:text-blue-900"
          >
            ↪ Reply
          </button>
          {renderComments(c.id)}
        </div>
      ));

  return (
    <div className="mt-10 bg-gray-100 p-4 border-4 border-black font-mono">
      <h3 className="text-xl font-extrabold underline mb-3">💬 Comments</h3>

      <div>{renderComments(null)}</div>

      <div className="mt-5">
        {replyTo && (
          <p className="text-sm bg-yellow-100 p-2 border border-black inline-block mb-2">
            Replying to <strong>{replyTo}</strong>{' '}
            <button
              onClick={() => setReplyTo(null)}
              className="ml-3 px-1 bg-red-500 text-white text-xs"
            >
              ✖ Cancel
            </button>
          </p>
        )}
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          rows={3}
          placeholder="Type your comment here..."
          className="w-full border-2 border-black p-2 font-mono bg-white resize-none"
        />
        <button
          onClick={addComment}
          className="mt-3 px-4 py-1 border-2 border-black bg-blue-600 text-white hover:bg-blue-800"
        >
          {replyTo ? 'Reply' : 'Comment'}
        </button>
      </div>
    </div>
  );
}
