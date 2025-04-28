export interface UserProfileSettings {
  email: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  taskReminders: boolean;
  studySessionReminders: boolean;
  groupUpdates: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  colorAccent: string;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showActivityOnLeaderboard: boolean;
  allowFriendRequests: boolean;
}

export interface UserSettings {
  profile: UserProfileSettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  privacy: PrivacySettings;
}

export type SettingsSection = 'profile' | 'notifications' | 'appearance' | 'privacy';