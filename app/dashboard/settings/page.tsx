"use client";

import { useState, useEffect } from 'react';
import { 
  UserSettings, 
  SettingsSection,
  UserProfileSettings,
  NotificationSettings as NotificationSettingsType,
  AppearanceSettings as AppearanceSettingsType,
  PrivacySettings as PrivacySettingsType
} from './types';
import { ProfileSettings } from './components/ProfileSettings';
import { NotificationSettings } from './components/NotificationSettings';
import { AppearanceSettings } from './components/AppearanceSettings';
import { PrivacySettings } from './components/PrivacySettings';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [activeTab, setActiveTab] = useState<SettingsSection>('profile');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Fetch settings data
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        setSettings(data.settings);
      } catch (error) {
        console.error('Failed to load settings:', error);
        setSaveStatus({
          success: false,
          message: 'Failed to load settings. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle profile settings update
  const handleProfileUpdate = async (profileData: UserProfileSettings) => {
    if (!settings) return;
    
    setIsSaving(true);
    setSaveStatus(null);
    
    const updatedSettings = {
      ...settings,
      profile: profileData
    };
    
    await saveSettings(updatedSettings);
  };

  // Handle notification settings update
  const handleNotificationUpdate = async (notificationData: NotificationSettingsType) => {
    if (!settings) return;
    
    setIsSaving(true);
    setSaveStatus(null);
    
    const updatedSettings = {
      ...settings,
      notifications: notificationData
    };
    
    await saveSettings(updatedSettings);
  };

  // Handle appearance settings update
  const handleAppearanceUpdate = async (appearanceData: AppearanceSettingsType) => {
    if (!settings) return;
    
    setIsSaving(true);
    setSaveStatus(null);
    
    const updatedSettings = {
      ...settings,
      appearance: appearanceData
    };
    
    await saveSettings(updatedSettings);
  };

  // Handle privacy settings update
  const handlePrivacyUpdate = async (privacyData: PrivacySettingsType) => {
    if (!settings) return;
    
    setIsSaving(true);
    setSaveStatus(null);
    
    const updatedSettings = {
      ...settings,
      privacy: privacyData
    };
    
    await saveSettings(updatedSettings);
  };

  // Save settings to the API
  const saveSettings = async (updatedSettings: UserSettings) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: updatedSettings }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.settings);
        setSaveStatus({
          success: true,
          message: 'Settings updated successfully'
        });
      } else {
        setSaveStatus({
          success: false,
          message: data.message || 'Failed to update settings'
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus({
        success: false,
        message: 'An error occurred while saving settings'
      });
    } finally {
      setIsSaving(false);
      
      // Clear the status message after a delay
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <Card className="p-8 text-center">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="container max-w-4xl py-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Unable to load settings</h2>
          <p className="text-gray-600 mb-4">There was a problem loading your settings. Please try again.</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        {saveStatus && (
          <div className={`px-3 py-2 rounded text-sm ${
            saveStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {saveStatus.message}
          </div>
        )}
      </div>
      
      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SettingsSection)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileSettings 
            profile={settings.profile} 
            onUpdate={handleProfileUpdate} 
            isLoading={isSaving}
          />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings 
            notifications={settings.notifications} 
            onUpdate={handleNotificationUpdate} 
            isLoading={isSaving}
          />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceSettings 
            appearance={settings.appearance} 
            onUpdate={handleAppearanceUpdate} 
            isLoading={isSaving}
          />
        </TabsContent>
        
        <TabsContent value="privacy">
          <PrivacySettings 
            privacy={settings.privacy} 
            onUpdate={handlePrivacyUpdate} 
            isLoading={isSaving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}