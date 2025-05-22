
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BodyTypeFilterProps {
  bodyType?: string;
  availableBodyTypes: string[];
  onFilterChange: (filterKey: string, value: any) => void;
}

export const BodyTypeFilter: React.FC<BodyTypeFilterProps> = ({
  bodyType,
  availableBodyTypes,
  onFilterChange
}) => {
  return (
    <div className="pt-2">
      <Select 
        value={bodyType} 
        onValueChange={(value) => onFilterChange('bodyType', value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select body type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {availableBodyTypes.map(type => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
