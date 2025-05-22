
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { SEATS } from '../filterConstants';

interface SeatsFilterProps {
  seats?: string;
  onFilterChange: (filterKey: string, value: any) => void;
}

export const SeatsFilter: React.FC<SeatsFilterProps> = ({
  seats,
  onFilterChange
}) => {
  return (
    <div className="pt-2 space-y-2">
      {SEATS.map(seat => (
        <div key={seat} className="flex items-center space-x-2">
          <Checkbox 
            id={`seat-${seat}`} 
            checked={seats === seat}
            onCheckedChange={() => onFilterChange('seats', seat)}
          />
          <label htmlFor={`seat-${seat}`} className="text-sm text-gray-700">
            {seat} Seats
          </label>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="seats-all" 
          checked={seats === 'all'}
          onCheckedChange={() => onFilterChange('seats', 'all')}
        />
        <label htmlFor="seats-all" className="text-sm text-gray-700">
          Any Seating
        </label>
      </div>
    </div>
  );
};
