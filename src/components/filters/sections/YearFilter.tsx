
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface YearFilterProps {
  minYear?: number;
  maxYear?: number;
  onFilterChange: (filterKey: string, value: any) => void;
}

export const YearFilter: React.FC<YearFilterProps> = ({
  minYear = 2000,
  maxYear = new Date().getFullYear(),
  onFilterChange
}) => {
  const handleYearRangeChange = (value: number[]) => {
    onFilterChange('minYear', value[0]);
    onFilterChange('maxYear', value[1]);
  };

  return (
    <div className="pt-2">
      <div className="text-sm text-gray-700 mb-1">
        {minYear} - {maxYear}
      </div>
      <div className="py-4 px-1">
        <Slider 
          defaultValue={[minYear, maxYear]} 
          value={[minYear, maxYear]}
          min={2000} 
          max={new Date().getFullYear()} 
          step={1}
          onValueChange={handleYearRangeChange}
          className="w-full"
        />
      </div>
    </div>
  );
};
