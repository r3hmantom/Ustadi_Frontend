// app/api/groups/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Using the same dummy data from the main groups route
// In a real implementation, this would be from a database
const dummyGroups = [
  {
    group_id: 1,
    group_name: "Advanced Mathematics Study Group",
    created_by: 1, // student_id reference
    created_at: "2025-03-15T10:30:00Z",
    is_active: true,
    description: "A group dedicated to advanced calculus and linear algebra topics",
    member_count: 8,
    meetings: [
      { id: 1, date: "2025-04-20T18:00:00Z", topic: "Linear Algebra Review" },
      { id: 2, date: "2025-04-27T18:00:00Z", topic: "Differential Equations" }
    ]
  },
  {
    group_id: 2,
    group_name: "Physics Problem Solving",
    created_by: 3,
    created_at: "2025-03-10T14:15:00Z",
    is_active: true,
    description: "Weekly sessions to solve complex physics problems together",
    member_count: 6,
    meetings: [
      { id: 3, date: "2025-04-18T17:00:00Z", topic: "Mechanics Problems" }
    ]
  },
  {
    group_id: 3,
    group_name: "Programming Project Collaboration",
    created_by: 1,
    created_at: "2025-02-28T09:45:00Z",
    is_active: true,
    description: "A group for students to collaborate on programming projects",
    member_count: 12,
    meetings: [
      { id: 4, date: "2025-04-19T16:00:00Z", topic: "Project Planning Session" },
      { id: 5, date: "2025-04-26T16:00:00Z", topic: "Code Review" }
    ]
  },
  {
    group_id: 4,
    group_name: "Literature Analysis Circle",
    created_by: 5,
    created_at: "2025-03-20T11:00:00Z",
    is_active: true,
    description: "Discussing classic and contemporary literature works",
    member_count: 5,
    meetings: [
      { id: 6, date: "2025-04-21T19:00:00Z", topic: "Shakespeare's Sonnets" }
    ]
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const groupId = parseInt(params.id);
  
  // Find the group with the matching ID
  const group = dummyGroups.find(g => g.group_id === groupId);
  
  if (!group) {
    return NextResponse.json(
      { error: "Group not found" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(group);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = parseInt(params.id);
    const body = await request.json();
    
    // Find the group with the matching ID
    const groupIndex = dummyGroups.findIndex(g => g.group_id === groupId);
    
    if (groupIndex === -1) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }
    
    // In a real implementation, we would update the database
    // For now, we'll just simulate updating the group
    const updatedGroup = {
      ...dummyGroups[groupIndex],
      group_name: body.group_name || dummyGroups[groupIndex].group_name,
      description: body.description || dummyGroups[groupIndex].description,
      is_active: body.is_active !== undefined ? body.is_active : dummyGroups[groupIndex].is_active
    };
    
    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("Error updating group:", error);
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const groupId = parseInt(params.id);
  
  // Find the group with the matching ID
  const groupIndex = dummyGroups.findIndex(g => g.group_id === groupId);
  
  if (groupIndex === -1) {
    return NextResponse.json(
      { error: "Group not found" },
      { status: 404 }
    );
  }
  
  // In a real implementation, we would delete from the database
  // For now, we'll just simulate deletion by marking as inactive
  
  return NextResponse.json({ message: "Group deleted successfully" });
}