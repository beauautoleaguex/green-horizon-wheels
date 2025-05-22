
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { TRANSMISSION_TYPES } from '../filterConstants';

interface TransmissionFilterProps {
  transmission?: string;
  onFilterChange: (filterKey: string, value: any) => void;
}

export const TransmissionFilter: React.FC<TransmissionFilterProps> = ({
  transmission,
  onFilterChange
}) => {
  return (
    <div className="pt-2 space-y-2">
      {TRANSMISSION_TYPES.map(transmissionType => (
        <div key={transmissionType} className="flex items-center space-x-2">
          <Checkbox 
            id={`transmission-${transmissionType}`} 
            checked={transmission === transmissionType}
            onCheckedChange={() => onFilterChange('transmission', transmissionType)}
          />
          <label htmlFor={`transmission-${transmissionType}`} className="text-sm text-gray-700">
            {transmissionType}
          </label>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="transmission-all" 
          checked={transmission === 'all'}
          onCheckedChange={() => onFilterChange('transmission', 'all')}
        />
        <label htmlFor="transmission-all" className="text-sm text-gray-700">
          Any Transmission
        </label>
      </div>
    </div>
  );
};
