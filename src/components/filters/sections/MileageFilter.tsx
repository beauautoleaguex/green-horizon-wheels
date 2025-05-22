
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface MileageFilterProps {
  minMileage?: number;
  maxMileage?: number;
  onFilterChange: (filterKey: string, value: any) => void;
}

export const MileageFilter: React.FC<MileageFilterProps> = ({
  minMileage = 0,
  maxMileage = 200000,
  onFilterChange
}) => {
  const handleMileageRangeChange = (value: number[]) => {
    onFilterChange('minMileage', value[0]);
    onFilterChange('maxMileage', value[1]);
  };

  return (
    <div className="pt-2">
      <div className="text-sm text-gray-700 mb-1">
        {minMileage?.toLocaleString()} - {maxMileage?.toLocaleString()} miles
      </div>
      <div className="py-4 px-1">
        <Slider 
          defaultValue={[minMileage, maxMileage]} 
          value={[minMileage, maxMileage]}
          min={0} 
          max={200000} 
          step={5000}
          onValueChange={handleMileageRangeChange}
          className="w-full"
        />
      </div>
    </div>
  );
};
