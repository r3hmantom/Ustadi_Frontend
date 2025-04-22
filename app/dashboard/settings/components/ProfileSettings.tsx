import { useState } from 'react';
import { UserProfileSettings } from '@/app/dashboard/settings/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface ProfileSettingsProps {
  profile: UserProfileSettings;
  onUpdate: (updatedProfile: UserProfileSettings) => void;
  isLoading?: boolean;
}

export function ProfileSettings({ profile, onUpdate, isLoading = false }: ProfileSettingsProps) {
  const [formData, setFormData] = useState<UserProfileSettings>(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled
          />
          <p className="text-sm text-gray-500">Email cannot be changed</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          <Input
            type="url"
            id="avatarUrl"
            name="avatarUrl"
            value={formData.avatarUrl || ''}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
          />
          {formData.avatarUrl && (
            <div className="mt-2">
              <img
                src={formData.avatarUrl}
                alt="Avatar preview"
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                }}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio || ''}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            className="min-h-[100px] w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Card>
  );
}