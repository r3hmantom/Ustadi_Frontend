import { useState } from 'react';
import { AppearanceSettings as AppearanceSettingsType } from '@/app/dashboard/settings/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AppearanceSettingsProps {
  appearance: AppearanceSettingsType;
  onUpdate: (updatedAppearance: AppearanceSettingsType) => void;
  isLoading?: boolean;
}

export function AppearanceSettings({ 
  appearance, 
  onUpdate, 
  isLoading = false 
}: AppearanceSettingsProps) {
  const [formData, setFormData] = useState<AppearanceSettingsType>(appearance);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setFormData(prev => ({ ...prev, theme }));
  };

  const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large') => {
    setFormData(prev => ({ ...prev, fontSize }));
  };

  const handleColorAccentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, colorAccent: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Appearance Settings</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            <ThemeButton 
              theme="light" 
              active={formData.theme === 'light'} 
              onClick={() => handleThemeChange('light')} 
            />
            <ThemeButton 
              theme="dark" 
              active={formData.theme === 'dark'} 
              onClick={() => handleThemeChange('dark')} 
            />
            <ThemeButton 
              theme="system" 
              active={formData.theme === 'system'} 
              onClick={() => handleThemeChange('system')} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Font Size</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            <FontSizeButton 
              size="small" 
              active={formData.fontSize === 'small'} 
              onClick={() => handleFontSizeChange('small')} 
            />
            <FontSizeButton 
              size="medium" 
              active={formData.fontSize === 'medium'} 
              onClick={() => handleFontSizeChange('medium')} 
            />
            <FontSizeButton 
              size="large" 
              active={formData.fontSize === 'large'} 
              onClick={() => handleFontSizeChange('large')} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="colorAccent">Accent Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              id="colorAccent"
              value={formData.colorAccent}
              onChange={handleColorAccentChange}
              className="w-12 h-10 p-1"
            />
            <span className="text-sm">{formData.colorAccent}</span>
          </div>
          <div className="mt-2 p-4 rounded-md" style={{ backgroundColor: formData.colorAccent }}>
            <p className="text-white font-medium">Preview</p>
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

interface ThemeButtonProps {
  theme: 'light' | 'dark' | 'system';
  active: boolean;
  onClick: () => void;
}

function ThemeButton({ theme, active, onClick }: ThemeButtonProps) {
  const baseClasses = "px-4 py-2 rounded-md border transition-all";
  const activeClasses = "border-primary bg-primary text-primary-foreground";
  const inactiveClasses = "border-gray-200 hover:border-gray-300";
  
  return (
    <button
      type="button"
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      {theme.charAt(0).toUpperCase() + theme.slice(1)}
    </button>
  );
}

interface FontSizeButtonProps {
  size: 'small' | 'medium' | 'large';
  active: boolean;
  onClick: () => void;
}

function FontSizeButton({ size, active, onClick }: FontSizeButtonProps) {
  const baseClasses = "px-4 py-2 rounded-md border transition-all";
  const activeClasses = "border-primary bg-primary text-primary-foreground";
  const inactiveClasses = "border-gray-200 hover:border-gray-300";
  
  const fontSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };
  
  return (
    <button
      type="button"
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses} ${fontSizes[size]}`}
      onClick={onClick}
    >
      {size.charAt(0).toUpperCase() + size.slice(1)}
    </button>
  );
}