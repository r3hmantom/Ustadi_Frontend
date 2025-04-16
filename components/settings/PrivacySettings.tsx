import { useState } from 'react';
import { PrivacySettings as PrivacySettingsType } from '@/app/dashboard/settings/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface PrivacySettingsProps {
  privacy: PrivacySettingsType;
  onUpdate: (updatedPrivacy: PrivacySettingsType) => void;
  isLoading?: boolean;
}

export function PrivacySettings({ 
  privacy, 
  onUpdate, 
  isLoading = false 
}: PrivacySettingsProps) {
  const [formData, setFormData] = useState<PrivacySettingsType>(privacy);

  const handleVisibilityChange = (visibility: 'public' | 'friends' | 'private') => {
    setFormData(prev => ({ ...prev, profileVisibility: visibility }));
  };

  const handleCheckboxChange = (field: 'showActivityOnLeaderboard' | 'allowFriendRequests') => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Privacy Settings</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Profile Visibility</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            <VisibilityButton 
              type="public" 
              active={formData.profileVisibility === 'public'} 
              onClick={() => handleVisibilityChange('public')} 
            />
            <VisibilityButton 
              type="friends" 
              active={formData.profileVisibility === 'friends'} 
              onClick={() => handleVisibilityChange('friends')} 
            />
            <VisibilityButton 
              type="private" 
              active={formData.profileVisibility === 'private'} 
              onClick={() => handleVisibilityChange('private')} 
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showActivityOnLeaderboard" 
              checked={formData.showActivityOnLeaderboard}
              onCheckedChange={() => handleCheckboxChange('showActivityOnLeaderboard')} 
            />
            <Label htmlFor="showActivityOnLeaderboard" className="cursor-pointer">
              Show my activity on the leaderboard
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="allowFriendRequests" 
              checked={formData.allowFriendRequests}
              onCheckedChange={() => handleCheckboxChange('allowFriendRequests')} 
            />
            <Label htmlFor="allowFriendRequests" className="cursor-pointer">
              Allow friend requests
            </Label>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h4 className="text-base font-medium mb-2">Data Privacy</h4>
          <p className="text-sm text-gray-600 mb-4">
            We respect your privacy and only use your data to improve your learning experience. 
            You can request a copy of your data or delete your account at any time.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm">
              Download my data
            </Button>
            <Button type="button" variant="outline" size="sm" className="text-red-500 hover:bg-red-50">
              Delete account
            </Button>
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

interface VisibilityButtonProps {
  type: 'public' | 'friends' | 'private';
  active: boolean;
  onClick: () => void;
}

function VisibilityButton({ type, active, onClick }: VisibilityButtonProps) {
  const baseClasses = "px-4 py-2 rounded-md border transition-all";
  const activeClasses = "border-primary bg-primary text-primary-foreground";
  const inactiveClasses = "border-gray-200 hover:border-gray-300";
  
  const labels = {
    public: 'Public',
    friends: 'Friends Only',
    private: 'Private'
  };
  
  return (
    <button
      type="button"
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      {labels[type]}
    </button>
  );
}