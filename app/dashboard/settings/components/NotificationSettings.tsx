import { useState } from 'react';
import { NotificationSettings as NotificationSettingsType } from '@/app/dashboard/settings/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface NotificationSettingsProps {
  notifications: NotificationSettingsType;
  onUpdate: (updatedNotifications: NotificationSettingsType) => void;
  isLoading?: boolean;
}

export function NotificationSettings({ 
  notifications, 
  onUpdate, 
  isLoading = false 
}: NotificationSettingsProps) {
  const [formData, setFormData] = useState<NotificationSettingsType>(notifications);

  const handleChange = (name: keyof NotificationSettingsType) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="emailNotifications" 
              checked={formData.emailNotifications}
              onCheckedChange={() => handleChange('emailNotifications')} 
            />
            <Label htmlFor="emailNotifications" className="cursor-pointer">
              Email Notifications
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="pushNotifications" 
              checked={formData.pushNotifications}
              onCheckedChange={() => handleChange('pushNotifications')} 
            />
            <Label htmlFor="pushNotifications" className="cursor-pointer">
              Push Notifications
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="taskReminders" 
              checked={formData.taskReminders}
              onCheckedChange={() => handleChange('taskReminders')} 
            />
            <Label htmlFor="taskReminders" className="cursor-pointer">
              Task Due Date Reminders
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="studySessionReminders" 
              checked={formData.studySessionReminders}
              onCheckedChange={() => handleChange('studySessionReminders')} 
            />
            <Label htmlFor="studySessionReminders" className="cursor-pointer">
              Study Session Reminders
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="groupUpdates" 
              checked={formData.groupUpdates}
              onCheckedChange={() => handleChange('groupUpdates')} 
            />
            <Label htmlFor="groupUpdates" className="cursor-pointer">
              Group Activity Updates
            </Label>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Card>
  );
}