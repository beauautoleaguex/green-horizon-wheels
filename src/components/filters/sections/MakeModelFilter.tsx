
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MakeModelFilterProps {
  make?: string;
  model?: string;
  availableMakes: string[];
  availableModels: string[];
  onFilterChange: (filterKey: string, value: any) => void;
}

export const MakeModelFilter: React.FC<MakeModelFilterProps> = ({
  make,
  model,
  availableMakes,
  availableModels,
  onFilterChange
}) => {
  return (
    <div className="space-y-4 pt-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
        <Select 
          value={make} 
          onValueChange={(value) => onFilterChange('make', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Makes</SelectItem>
            {availableMakes.map(make => (
              <SelectItem key={make} value={make}>{make}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
        <Select 
          value={model} 
          onValueChange={(value) => onFilterChange('model', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            {availableModels.map(model => (
              <SelectItem key={model} value={model}>{model}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
