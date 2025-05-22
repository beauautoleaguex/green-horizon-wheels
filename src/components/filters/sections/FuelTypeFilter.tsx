
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { FUEL_TYPES } from '../filterConstants';

interface FuelTypeFilterProps {
  fuelType?: string;
  onFilterChange: (filterKey: string, value: any) => void;
}

export const FuelTypeFilter: React.FC<FuelTypeFilterProps> = ({
  fuelType,
  onFilterChange
}) => {
  return (
    <div className="pt-2 space-y-2">
      {FUEL_TYPES.map(fuel => (
        <div key={fuel} className="flex items-center space-x-2">
          <Checkbox 
            id={`fuel-${fuel}`} 
            checked={fuelType === fuel}
            onCheckedChange={() => onFilterChange('fuelType', fuel)}
          />
          <label htmlFor={`fuel-${fuel}`} className="text-sm text-gray-700">
            {fuel}
          </label>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="fuel-all" 
          checked={fuelType === 'all'}
          onCheckedChange={() => onFilterChange('fuelType', 'all')}
        />
        <label htmlFor="fuel-all" className="text-sm text-gray-700">
          Any Fuel Type
        </label>
      </div>
    </div>
  );
};
