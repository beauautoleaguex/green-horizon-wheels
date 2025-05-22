
import React from 'react';
import { Search } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DesktopSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export const DesktopSearchBar: React.FC<DesktopSearchBarProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch 
}) => {
  return (
    <div className="hidden md:block p-4 border-b border-gray-100">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            className="pl-10 rounded-md border border-gray-300 w-full"
            placeholder="Search makes, models, or keywords"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          type="submit" 
          size="icon" 
          variant="ghost" 
          className="bg-[#F1F0FB] hover:bg-gray-200"
        >
          <Search className="h-5 w-5 text-[#8E9196]" />
        </Button>
      </form>
    </div>
  );
};
