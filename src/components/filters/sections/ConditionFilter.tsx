
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { CONDITIONS } from '../filterConstants';

interface ConditionFilterProps {
  condition?: string;
  onFilterChange: (filterKey: string, value: any) => void;
}

export const ConditionFilter: React.FC<ConditionFilterProps> = ({
  condition,
  onFilterChange
}) => {
  return (
    <div className="pt-2 space-y-2">
      {CONDITIONS.map(conditionOption => (
        <div key={conditionOption} className="flex items-center space-x-2">
          <Checkbox 
            id={`condition-${conditionOption}`} 
            checked={condition === conditionOption}
            onCheckedChange={() => onFilterChange('condition', conditionOption)}
          />
          <label htmlFor={`condition-${conditionOption}`} className="text-sm text-gray-700">
            {conditionOption}
          </label>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="condition-all" 
          checked={condition === 'all'}
          onCheckedChange={() => onFilterChange('condition', 'all')}
        />
        <label htmlFor="condition-all" className="text-sm text-gray-700">
          All Conditions
        </label>
      </div>
    </div>
  );
};
