
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { COLORS } from '../filterConstants';

interface ColorFilterProps {
  color?: string;
  onFilterChange: (filterKey: string, value: any) => void;
}

export const ColorFilter: React.FC<ColorFilterProps> = ({
  color,
  onFilterChange
}) => {
  return (
    <div className="pt-2 grid grid-cols-2 gap-2">
      {COLORS.map(colorOption => (
        <div key={colorOption} className="flex items-center space-x-2">
          <Checkbox 
            id={`color-${colorOption}`} 
            checked={color === colorOption}
            onCheckedChange={() => onFilterChange('color', colorOption)}
          />
          <label htmlFor={`color-${colorOption}`} className="text-sm text-gray-700">
            {colorOption}
          </label>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="color-all" 
          checked={color === 'all'}
          onCheckedChange={() => onFilterChange('color', 'all')}
        />
        <label htmlFor="color-all" className="text-sm text-gray-700">
          Any Color
        </label>
      </div>
    </div>
  );
};
