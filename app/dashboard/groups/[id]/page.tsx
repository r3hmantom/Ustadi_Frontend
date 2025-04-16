"use client";

import React, { useState, useEffect } from 'react';
import { StaggerContainer } from '@/components/ui/animated-elements';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Group, GroupMember } from '../types';
import { 
  Calendar, 
  Users, 
  ChevronLeft, 
  User, 
  Clock, 
  CalendarPlus,
  UserPlus,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  // Unwrap the params object using React.use()
  const unwrappedParams = React.use(params);
  const groupId = unwrappedParams.id;
  
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberLoading, setMemberLoading] = useState(true);

  // Hard-coded current user ID (would come from auth context in a real app)
  const currentStudentId = 1;

  useEffect(() => {
    // Fetch group details
    const fetchGroup = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/groups/${groupId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch group details');
        }
        const data = await response.json();
        setGroup(data);
      } catch (error) {
        console.error('Error fetching group details:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch group members
    const fetchMembers = async () => {
      setMemberLoading(true);
      try {
        const response = await fetch(`/api/groups/${groupId}/members`);
        if (!response.ok) {
          throw new Error('Failed to fetch group members');
        }
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching group members:', error);
        setMembers([]);
      } finally {
        setMemberLoading(false);
      }
    };

    fetchGroup();
    fetchMembers();
  }, [groupId]);

  // Check if current user is a member of this group
  const currentUserIsMember = members.some(member => member.student_id === currentStudentId);
  
  // Check if current user is the group leader
  const currentUserIsLeader = members.some(
    member => member.student_id === currentStudentId && member.role === 'Leader'
  );

  // Handle leaving the group
  const handleLeaveGroup = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;
    
    try {
      const response = await fetch(`/api/groups/${groupId}/members?student_id=${currentStudentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to leave group');
      }

      // Update the members list
      setMembers(members.filter(member => member.student_id !== currentStudentId));
      alert('You have left the group successfully');
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Failed to leave the group. Please try again.');
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render 404 state if group not found
  if (!group) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600">Group Not Found</h1>
        <p className="mt-2 text-gray-600">The study group you're looking for doesn't exist or has been deleted.</p>
        <Link href="/dashboard/groups" passHref>
          <Button className="mt-6">
            <ChevronLeft size={16} className="mr-2" />
            Back to Groups
          </Button>
        </Link>
      </div>
    );
  }

  // Format the date for display
  const formattedDate = new Date(group.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <StaggerContainer>
      {/* Back button and actions */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/dashboard/groups" passHref>
          <Button variant="outline" size="sm">
            <ChevronLeft size={16} className="mr-2" />
            Back to Groups
          </Button>
        </Link>
        
        <div className="space-x-2">
          {currentUserIsMember && !currentUserIsLeader && (
            <Button variant="outline" size="sm" className="text-red-500" onClick={handleLeaveGroup}>
              Leave Group
            </Button>
          )}
          
          {currentUserIsLeader && (
            <>
              <Button variant="outline" size="sm">
                <CalendarPlus size={16} className="mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" size="sm">
                <UserPlus size={16} className="mr-2" />
                Invite Members
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Group details card */}
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{group.group_name}</h1>
            <p className="text-gray-600 mt-2">{group.description}</p>
          </div>
          
          {currentUserIsLeader && (
            <Button variant="outline" size="sm">
              Edit Group
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex items-center">
            <Users className="mr-2 text-blue-500" size={18} />
            <span>{group.member_count} members</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 text-blue-500" size={18} />
            <span>Created on {formattedDate}</span>
          </div>
        </div>
      </Card>

      {/* Upcoming meetings */}
      <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
      <div className="mb-8">
        {group.meetings && group.meetings.length > 0 ? (
          <div className="space-y-4">
            {group.meetings
              .filter(meeting => new Date(meeting.date) > new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map(meeting => (
                <Card key={meeting.id} className="p-4 flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Calendar className="text-blue-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{meeting.topic}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(meeting.date).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Join</Button>
                </Card>
              ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-600">No upcoming meetings scheduled</p>
            {currentUserIsLeader && (
              <Button className="mt-4" size="sm">
                <CalendarPlus size={16} className="mr-2" />
                Schedule a Meeting
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* Group members */}
      <h2 className="text-xl font-semibold mb-4">Group Members</h2>
      <div className="mb-8">
        {memberLoading ? (
          <Card className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </Card>
        ) : members.length > 0 ? (
          <div className="space-y-2">
            {members.map((member) => (
              <Card key={`${member.group_id}-${member.student_id}`} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-full p-2 mr-3">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{member.student_name}</p>
                      <div className="flex items-center text-xs text-gray-600">
                        <span className={`inline-block px-2 py-1 rounded ${
                          member.role === 'Leader' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                        }`}>
                          {member.role}
                        </span>
                        <span className="mx-2">•</span>
                        <Clock size={12} className="mr-1" />
                        <span>Joined {formatDistanceToNow(new Date(member.joined_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  
                  {currentUserIsLeader && member.student_id !== currentStudentId && (
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-600">No members found</p>
          </Card>
        )}
      </div>
    </StaggerContainer>
  );
}