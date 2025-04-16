"use client";

import React, { useState, useEffect } from 'react';
import { StaggerContainer } from '@/components/ui/animated-elements';
import { GroupList } from '@/components/group-study/GroupList';
import { GroupForm } from '@/components/group-study/GroupForm';
import { Group, CreateGroupForm } from './types';
import { Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Hard-coded student ID for now (would come from auth context in a real app)
  const currentStudentId = 1;

  useEffect(() => {
    // Fetch all groups
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/groups');
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        
        const data = await response.json();
        setGroups(data);
        
        // Filter for groups that the current user is a member of
        // In a real app, this would be a separate API call with student_id filter
        const userGroups = data.filter(
          (group: Group) => group.created_by === currentStudentId
        );
        setMyGroups(userGroups);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setGroups([]);
        setMyGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [currentStudentId]);

  // Function to handle creating a new group
  const handleCreateGroup = async (data: CreateGroupForm) => {
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      const newGroup = await response.json();
      
      // Add the new group to the lists
      setGroups([...groups, newGroup]);
      setMyGroups([...myGroups, newGroup]);
      
      // Show success notification (could implement)
      alert('Group created successfully!');
    } catch (error) {
      console.error('Error creating group:', error);
      // Show error notification (could implement)
      alert('Failed to create group. Please try again.');
    }
  };

  // Function to handle joining a group
  const handleJoinGroup = async (groupId: number) => {
    try {
      // Check if the group exists
      const groupExists = groups.find(g => g.group_id === groupId);
      if (!groupExists) {
        throw new Error('Group not found with that ID');
      }

      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: currentStudentId,
          role: 'Member'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join group');
      }

      // Update the groups to reflect membership
      // In a real app, we would refetch the groups or update the state more accurately
      const updatedGroups = groups.map(g => 
        g.group_id === groupId 
          ? { ...g, member_count: g.member_count + 1 }
          : g
      );
      
      setGroups(updatedGroups);
      setMyGroups([...myGroups, groupExists]);
      
      // Show success notification
      alert('Successfully joined the group!');
    } catch (error) {
      console.error('Error joining group:', error);
      // Show error notification
      alert(`Failed to join group: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Filter groups based on search term
  const filteredAllGroups = groups.filter(group =>
    group.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMyGroups = myGroups.filter(group =>
    group.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StaggerContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Study Groups</h1>
          <p className="text-gray-600">Create or join study groups to collaborate with others</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Form for creating/joining groups */}
        <div>
          <GroupForm 
            onCreateGroup={handleCreateGroup} 
            onJoinGroup={handleJoinGroup}
            studentId={currentStudentId}
          />
        </div>

        {/* Right column: List of groups with tabs */}
        <div className="lg:col-span-2">
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search groups..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">
                <Users className="mr-2 h-4 w-4" />
                All Groups
              </TabsTrigger>
              <TabsTrigger value="my">
                <Users className="mr-2 h-4 w-4" />
                My Groups
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <GroupList groups={filteredAllGroups} loading={loading} />
            </TabsContent>
            <TabsContent value="my" className="mt-4">
              <GroupList groups={filteredMyGroups} loading={loading} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StaggerContainer>
  );
}