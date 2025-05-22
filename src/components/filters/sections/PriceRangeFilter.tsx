
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface PriceRangeFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onFilterChange: (filterKey: string, value: any) => void;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice = 0,
  maxPrice = 200000,
  onFilterChange
}) => {
  const handlePriceRangeChange = (value: number[]) => {
    onFilterChange('minPrice', value[0]);
    onFilterChange('maxPrice', value[1]);
  };

  return (
    <div className="pt-2">
      <div className="text-sm text-gray-700 mb-1">
        ${minPrice?.toLocaleString()} - ${maxPrice?.toLocaleString()}
      </div>
      <div className="py-4 px-1">
        <Slider 
          defaultValue={[minPrice, maxPrice]} 
          value={[minPrice, maxPrice]}
          min={0} 
          max={200000} 
          step={5000}
          onValueChange={handlePriceRangeChange}
          className="w-full"
        />
      </div>
    </div>
  );
};
