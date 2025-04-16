import { NextResponse } from 'next/server';
import { UserSettings } from '@/app/dashboard/settings/types';

// Dummy settings data that follows the schema structure
const dummySettings: UserSettings = {
  profile: {
    email: 'student@example.com',
    fullName: 'John Doe',
    avatarUrl: 'https://i.pravatar.cc/150?u=student',
    bio: 'Computer Science student passionate about machine learning and web development.'
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    studySessionReminders: true,
    groupUpdates: true
  },
  appearance: {
    theme: 'system',
    fontSize: 'medium',
    colorAccent: '#0070f3'
  },
  privacy: {
    profileVisibility: 'public',
    showActivityOnLeaderboard: true,
    allowFriendRequests: true
  }
};

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({ settings: dummySettings });
}

export async function PUT(request: Request) {
  // Parse the request body
  const data = await request.json();
  
  // In a real implementation, you would validate and update the settings in a database
  // For now, we'll just return the received data as if it was successfully updated
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({ 
    success: true, 
    message: 'Settings updated successfully',
    settings: data.settings || dummySettings
  });
}