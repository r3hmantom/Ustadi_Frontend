// app/api/groups/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Dummy data for study groups following the schema structure
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

export async function GET(request: NextRequest) {
  // Parse query parameters if needed
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('student_id');
  const isActive = searchParams.get('is_active');
  
  // Filter groups based on query parameters if provided
  let filteredGroups = [...dummyGroups];
  
  // For now, we'll just return all groups
  // In a real implementation, we would filter based on the studentId, etc.
  
  return NextResponse.json(filteredGroups);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.group_name || !body.created_by) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // In a real implementation, we would insert into the database
    // For now, we'll just simulate creating a new group
    const newGroup = {
      group_id: dummyGroups.length + 1,
      group_name: body.group_name,
      created_by: body.created_by,
      created_at: new Date().toISOString(),
      is_active: true,
      description: body.description || "",
      member_count: 1, // Creator is the first member
      meetings: []
    };
    
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}