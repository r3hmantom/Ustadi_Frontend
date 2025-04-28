"use client";

import React from 'react';
import { Group } from '@/app/dashboard/groups/types';
import { GroupCard } from './GroupCard';
import { Loader2 } from 'lucide-react';

interface GroupListProps {
  groups: Group[];
  loading: boolean;
}

export function GroupList({ groups, loading }: GroupListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading study groups...</span>
      </div>
    );
  }

  if (!groups.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">No study groups found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Create a new group or join an existing one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <GroupCard key={group.group_id} group={group} />
      ))}
    </div>
  );
}