
import React, { useState, useEffect } from 'react';
import { VehicleFilters } from '@/services/vehicleService';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { Accordion } from '@/components/ui/accordion';
import { FilterSections } from './FilterSections';

interface SearchFiltersProps {
  onFilter: (filters: VehicleFilters) => void;
  availableMakes?: string[];
  availableModels?: string[];
  availableBodyTypes?: string[];
}

// Default filter values
export const defaultFilters: VehicleFilters = {
  make: 'all',
  model: 'all',
  minPrice: 0,
  maxPrice: 200000,
  minYear: 2000,
  maxYear: new Date().getFullYear(),
  bodyType: 'all',
  condition: 'all',
  minMileage: 0,
  maxMileage: 200000,
  transmission: 'all',
  fuelType: 'all',
  color: 'all',
  features: [],
  seats: 'all',
};

export const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  onFilter,
  availableMakes = [],
  availableModels = [],
  availableBodyTypes = []
}) => {
  const [filters, setFilters] = useState<VehicleFilters>(defaultFilters);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Initialize with default filters when component mounts
  useEffect(() => {
    console.log("SearchFilters initialized with defaults:", defaultFilters);
    onFilter(defaultFilters);
  }, []);

  // Check if any filter is active (not default)
  useEffect(() => {
    const isActive = Object.entries(filters).some(([key, value]) => {
      if (key === 'features' && Array.isArray(value)) {
        return value.length > 0;
      }
      
      if (['minPrice', 'maxPrice'].includes(key)) {
        return value !== defaultFilters[key as keyof VehicleFilters];
      }
      
      if (['minYear', 'maxYear'].includes(key)) {
        return value !== defaultFilters[key as keyof VehicleFilters];
      }
      
      if (['minMileage', 'maxMileage'].includes(key)) {
        return value !== defaultFilters[key as keyof VehicleFilters];
      }
      
      return value !== 'all' && value !== defaultFilters[key as keyof VehicleFilters];
    });
    
    setHasActiveFilters(isActive);
  }, [filters]);

  // Apply filters whenever they change
  useEffect(() => {
    console.log("Filters changed, applying:", filters);
    onFilter(filters);
  }, [filters, onFilter]);

  const handleFilterChange = (filterKey: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearAllFilters = () => {
    console.log("Clearing all filters to defaults");
    setFilters(defaultFilters);
  };

  return (
    <div className="bg-white max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="space-y-2">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-xs h-7"
              onClick={clearAllFilters}
            >
              <X className="h-3 w-3" />
              Clear all
            </Button>
          )}
        </div>
        
        <FilterSections 
          filters={filters}
          availableMakes={availableMakes}
          availableModels={availableModels}
          availableBodyTypes={availableBodyTypes}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
};
