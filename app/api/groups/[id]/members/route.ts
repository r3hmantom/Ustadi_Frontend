// app/api/groups/[id]/members/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Dummy data for group members following the schema structure
const dummyGroupMembers = [
  // Group 1 members
  { group_id: 1, student_id: 1, joined_at: "2025-03-15T10:30:00Z", role: "Leader" },
  { group_id: 1, student_id: 2, joined_at: "2025-03-15T11:45:00Z", role: "Member" },
  { group_id: 1, student_id: 3, joined_at: "2025-03-16T09:30:00Z", role: "Member" },
  { group_id: 1, student_id: 4, joined_at: "2025-03-16T14:20:00Z", role: "Member" },
  { group_id: 1, student_id: 8, joined_at: "2025-03-17T16:10:00Z", role: "Member" },
  
  // Group 2 members
  { group_id: 2, student_id: 3, joined_at: "2025-03-10T14:15:00Z", role: "Leader" },
  { group_id: 2, student_id: 5, joined_at: "2025-03-11T10:30:00Z", role: "Member" },
  { group_id: 2, student_id: 6, joined_at: "2025-03-12T15:45:00Z", role: "Member" },
  
  // Group 3 members
  { group_id: 3, student_id: 1, joined_at: "2025-02-28T09:45:00Z", role: "Leader" },
  { group_id: 3, student_id: 4, joined_at: "2025-03-01T13:20:00Z", role: "Member" },
  { group_id: 3, student_id: 7, joined_at: "2025-03-02T11:30:00Z", role: "Member" },
  
  // Group 4 members
  { group_id: 4, student_id: 5, joined_at: "2025-03-20T11:00:00Z", role: "Leader" },
  { group_id: 4, student_id: 2, joined_at: "2025-03-21T15:30:00Z", role: "Member" }
];

// Dummy student data for populating member information
const dummyStudents = [
  { student_id: 1, full_name: "Abdul Rehman", email: "abdul@example.com" },
  { student_id: 2, full_name: "Sarah Khan", email: "sarah@example.com" },
  { student_id: 3, full_name: "Michael Thompson", email: "michael@example.com" },
  { student_id: 4, full_name: "Lisa Wong", email: "lisa@example.com" },
  { student_id: 5, full_name: "James Brown", email: "james@example.com" },
  { student_id: 6, full_name: "Emma Davis", email: "emma@example.com" },
  { student_id: 7, full_name: "David Miller", email: "david@example.com" },
  { student_id: 8, full_name: "Sophia Wilson", email: "sophia@example.com" }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const groupId = parseInt(params.id);
  
  // Find members for the specified group
  const members = dummyGroupMembers
    .filter(m => m.group_id === groupId)
    .map(member => {
      // Enrich member data with student information
      const student = dummyStudents.find(s => s.student_id === member.student_id);
      return {
        ...member,
        student_name: student?.full_name || "Unknown",
        student_email: student?.email || "unknown@example.com"
      };
    });
  
  if (members.length === 0) {
    return NextResponse.json(
      { error: "No members found for this group" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(members);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = parseInt(params.id);
    const body = await request.json();
    
    // Validate required fields
    if (!body.student_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Check if the student is already a member of the group
    const existingMember = dummyGroupMembers.find(
      m => m.group_id === groupId && m.student_id === body.student_id
    );
    
    if (existingMember) {
      return NextResponse.json(
        { error: "Student is already a member of this group" },
        { status: 400 }
      );
    }
    
    // In a real implementation, we would insert into the database
    // For now, we'll just simulate adding a new member
    const newMember = {
      group_id: groupId,
      student_id: body.student_id,
      joined_at: new Date().toISOString(),
      role: body.role || "Member"
    };
    
    // Enrich member data with student information for the response
    const student = dummyStudents.find(s => s.student_id === body.student_id);
    const enrichedMember = {
      ...newMember,
      student_name: student?.full_name || "Unknown",
      student_email: student?.email || "unknown@example.com"
    };
    
    return NextResponse.json(enrichedMember, { status: 201 });
  } catch (error) {
    console.error("Error adding group member:", error);
    return NextResponse.json(
      { error: "Failed to add group member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const groupId = parseInt(params.id);
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('student_id');
  
  if (!studentId) {
    return NextResponse.json(
      { error: "Missing student_id parameter" },
      { status: 400 }
    );
  }
  
  // Check if the member exists
  const memberIndex = dummyGroupMembers.findIndex(
    m => m.group_id === groupId && m.student_id === parseInt(studentId)
  );
  
  if (memberIndex === -1) {
    return NextResponse.json(
      { error: "Member not found in this group" },
      { status: 404 }
    );
  }
  
  // In a real implementation, we would delete from the database
  // For now, we'll just simulate deletion
  
  return NextResponse.json({ message: "Member removed successfully" });
}