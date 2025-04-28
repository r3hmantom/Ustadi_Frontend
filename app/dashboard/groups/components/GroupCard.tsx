"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Calendar, ChevronRight } from 'lucide-react';
import type { Group } from '@/app/dashboard/groups/types';

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  // Format the date to be more readable
  const formattedDate = new Date(group.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Get the next meeting if any
  const nextMeeting = group.meetings.length > 0 
    ? group.meetings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] 
    : null;
  
  const formattedNextMeeting = nextMeeting 
    ? new Date(nextMeeting.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'No scheduled meetings';

  return (
    <Card className="p-4 h-full flex flex-col justify-between transition-all hover:shadow-md">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold line-clamp-2">{group.group_name}</h3>
        </div>
        
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{group.description}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Users size={16} className="mr-2" />
            <span>{group.member_count} {group.member_count === 1 ? 'member' : 'members'}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span>Created on {formattedDate}</span>
          </div>
          
          {nextMeeting && (
            <div className="mt-3 p-2 bg-blue-50 rounded-md">
              <p className="text-xs font-medium text-blue-800">Next Meeting</p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-blue-700">{formattedNextMeeting}</p>
                <p className="text-xs text-blue-600">{nextMeeting.topic}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Link href={`/dashboard/groups/${group.group_id}`} passHref>
          <Button variant="outline" className="text-sm">
            View Group <ChevronRight size={16} className="ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}