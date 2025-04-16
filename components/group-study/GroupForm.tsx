// components/group-study/GroupForm.tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CreateGroupForm } from '@/app/dashboard/groups/types';
import { Loader2, UserPlus } from 'lucide-react';

interface GroupFormProps {
  onCreateGroup: (data: CreateGroupForm) => Promise<void>;
  onJoinGroup: (groupId: number) => Promise<void>;
  studentId: number;
}

export function GroupForm({ onCreateGroup, onJoinGroup, studentId }: GroupFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [groupIdToJoin, setGroupIdToJoin] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName) return;
    
    setIsCreating(true);
    try {
      await onCreateGroup({ 
        group_name: groupName, 
        description, 
        created_by: studentId 
      });
      
      // Reset form on success
      setGroupName('');
      setDescription('');
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupIdToJoin) return;
    
    setIsJoining(true);
    try {
      await onJoinGroup(parseInt(groupIdToJoin));
      
      // Reset form on success
      setGroupIdToJoin('');
    } catch (error) {
      console.error("Error joining group:", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'create'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Create Group
        </button>
        <button
          onClick={() => setActiveTab('join')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'join'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Join Group
        </button>
      </div>

      {activeTab === 'create' ? (
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="Enter group description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <Button type="submit" disabled={isCreating || !groupName}>
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Study Group
          </Button>
        </form>
      ) : (
        <form onSubmit={handleJoinGroup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-code">Group ID</Label>
            <Input
              id="group-code"
              placeholder="Enter group ID to join"
              value={groupIdToJoin}
              onChange={(e) => setGroupIdToJoin(e.target.value)}
              required
              type="number"
            />
          </div>
          
          <Button type="submit" disabled={isJoining || !groupIdToJoin}>
            {isJoining ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Join Group
          </Button>
        </form>
      )}
    </Card>
  );
}