
import React from 'react';
import { Palette, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface HeaderProps {
  onSave: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSave }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4 border-b dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-brand-green" />
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Brand Manager</h1>
          </div>
          <div className="flex gap-2 items-center">
            <ThemeToggle />
            <Button onClick={onSave} className="gap-1">
              <Save className="h-4 w-4" />
              Save Brands
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
