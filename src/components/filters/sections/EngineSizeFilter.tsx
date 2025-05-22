
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EngineSizeFilterProps {
  engineSize?: string;
  onFilterChange: (filterKey: string, value: any) => void;
}

export const EngineSizeFilter: React.FC<EngineSizeFilterProps> = ({
  engineSize,
  onFilterChange
}) => {
  return (
    <div className="pt-2">
      <Select 
        value={engineSize?.toString() || 'all'} 
        onValueChange={(value) => onFilterChange('engineSize', value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select engine size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Size</SelectItem>
          <SelectItem value="1.0">Up to 1.0L</SelectItem>
          <SelectItem value="1.5">1.0L - 1.5L</SelectItem>
          <SelectItem value="2.0">1.5L - 2.0L</SelectItem>
          <SelectItem value="2.5">2.0L - 2.5L</SelectItem>
          <SelectItem value="3.0">2.5L - 3.0L</SelectItem>
          <SelectItem value="4.0">3.0L - 4.0L</SelectItem>
          <SelectItem value="5.0">Over 4.0L</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
