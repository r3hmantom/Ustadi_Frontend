// app/dashboard/groups/types.ts
export interface GroupMeeting {
  id: number;
  date: string;
  topic: string;
}

export interface Group {
  group_id: number;
  group_name: string;
  created_by: number; 
  created_at: string;
  is_active: boolean;
  description: string;
  member_count: number;
  meetings: GroupMeeting[];
}

export interface GroupMember {
  group_id: number;
  student_id: number;
  joined_at: string;
  role: 'Leader' | 'Member';
  student_name?: string;
  student_email?: string;
}

export interface CreateGroupForm {
  group_name: string;
  description: string;
  created_by: number;
}

export interface UpdateGroupForm {
  group_name?: string;
  description?: string;
  is_active?: boolean;
}

export interface AddMemberForm {
  student_id: number;
  role?: 'Leader' | 'Member';
}