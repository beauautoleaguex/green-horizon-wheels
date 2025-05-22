
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { VehicleFilters } from '@/services/vehicleService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface SearchFiltersProps {
  onFilter: (filters: VehicleFilters) => void;
  availableMakes?: string[];
  availableModels?: string[];
  availableBodyTypes?: string[];
}

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const TRANSMISSION_TYPES = ['Automatic', 'Manual', 'Semi-Auto', 'CVT'];
const CONDITIONS = ['New', 'Used', 'Demo'];
const COLORS = ['Black', 'White', 'Silver', 'Grey', 'Blue', 'Red', 'Green', 'Brown', 'Gold', 'Yellow'];
const FEATURES = [
  'Bluetooth', 'Navigation', 'Leather Seats', 'Sunroof', 'Backup Camera',
  'Heated Seats', 'Apple CarPlay', 'Android Auto', 'Cruise Control', 'Climate Control'
];
const SEATS = ['2', '4', '5', '6', '7', '8+'];

// Default filter values
const defaultFilters: VehicleFilters = {
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1]
    }));
  };

  const handleYearRangeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      minYear: value[0],
      maxYear: value[1]
    }));
  };

  const handleMileageRangeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      minMileage: value[0],
      maxMileage: value[1]
    }));
  };

  const handleCheckboxChange = (feature: string, checked: boolean) => {
    setFilters(prev => {
      const currentFeatures = Array.isArray(prev.features) ? prev.features : [];
      
      if (checked) {
        return { ...prev, features: [...currentFeatures, feature] };
      } else {
        return { ...prev, features: currentFeatures.filter(f => f !== feature) };
      }
    });
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
        
        <Accordion type="single" collapsible defaultValue="make-model" className="space-y-0">
          <AccordionItem value="make-model" className="border-0">
            <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Make and Model</AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  <Select 
                    value={filters.make} 
                    onValueChange={(value) => handleSelectChange('make', value)}
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
                    value={filters.model} 
                    onValueChange={(value) => handleSelectChange('model', value)}
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
            </AccordionContent>
          </AccordionItem>
          <Separator />
          
          <AccordionItem value="price" className="border-0">
            <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Price Range</AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-2">
                <div className="text-sm text-gray-700 mb-1">
                  ${filters.minPrice?.toLocaleString()} - ${filters.maxPrice?.toLocaleString()}
                </div>
                <div className="py-4 px-1">
                  <Slider 
                    defaultValue={[filters.minPrice || 0, filters.maxPrice || 200000]} 
                    value={[filters.minPrice || 0, filters.maxPrice || 200000]}
                    min={0} 
                    max={200000} 
                    step={5000}
                    onValueChange={handlePriceRangeChange}
                    className="w-full"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />
          
          <AccordionItem value="year" className="border-0">
            <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Year</AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-2">
                <div className="text-sm text-gray-700 mb-1">
                  {filters.minYear} - {filters.maxYear}
                </div>
                <div className="py-4 px-1">
                  <Slider 
                    defaultValue={[filters.minYear || 2000, filters.maxYear || new Date().getFullYear()]} 
                    value={[filters.minYear || 2000, filters.maxYear || new Date().getFullYear()]}
                    min={2000} 
                    max={new Date().getFullYear()} 
                    step={1}
                    onValueChange={handleYearRangeChange}
                    className="w-full"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />
          
          <AccordionItem value="body-type" className="border-0">
            <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Body Type</AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-2">
                <Select 
                  value={filters.bodyType} 
                  onValueChange={(value) => handleSelectChange('bodyType', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {availableBodyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />
          
          <AccordionItem value="condition" className="border-0">
            <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Condition</AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-2 space-y-2">
                {CONDITIONS.map(condition => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`condition-${condition}`} 
                      checked={filters.condition === condition}
                      onCheckedChange={() => handleSelectChange('condition', condition)}
                    />
                    <label htmlFor={`condition-${condition}`} className="text-sm text-gray-700">
                      {condition}
                    </label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="condition-all" 
                    checked={filters.condition === 'all'}
                    onCheckedChange={() => handleSelectChange('condition', 'all')}
                  />
                  <label htmlFor="condition-all" className="text-sm text-gray-700">
                    All Conditions
                  </label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />
          
          <AccordionItem value="mileage" className="border-0">
            <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Mileage</AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-2">
                <div className="text-sm text-gray-700 mb-1">
                  {filters.minMileage?.toLocaleString()} - {filters.maxMileage?.toLocaleString()} miles
                </div>
                <div className="py-4 px-1">
                  <Slider 
                    defaultValue={[filters.minMileage || 0, filters.maxMileage || 200000]} 
                    value={[filters.minMileage || 0, filters.maxMileage || 200000]}
                    min={0} 
                    max={200000} 
                    step={5000}
                    onValueChange={handleMileageRangeChange}
                    className="w-full"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />
          
          <AccordionItem value="transmission" className="border-0">
            <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Transmission</AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-2 space-y-2">
                {TRANSMISSION_TYPES.map(transmission => (
                  <div key={transmission} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`transmission-${transmission}`} 
                      checked={filters.transmission === transmission}
                      onCheckedChange={() => handleSelectChange('transmission', transmission)}
                    />
                    <label htmlFor={`transmission-${transmission}`} className="text-sm text-gray-700">
                      {transmission}
                    </label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="transmission-all" 
                    checked={filters.transmission === 'all'}
                    onCheckedChange={() => handleSelectChange('transmission', 'all')}
                  />
                  <label htmlFor="transmission-all" className="text-sm text-gray-700">
                    Any Transmission
                  </label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />
          
          <AccordionItem value="fuel-type" className="border-0">
            <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Fuel Type</AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-2 space-y-2">
                {FUEL_TYPES.map(fuelType => (
                  <div key={fuelType} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`fuel-${fuelType}`} 
                      checked={filters.fuelType === fuelType}
                      onCheckedChange={() => handleSelectChange('fuelType', fuelType)}
                    />
                    <label htmlFor={`fuel-${fuelType}`} className="text-sm text-gray-700">
                      {fuelType}
                    </label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="fuel-all" 
                    checked={filters.fuelType === 'all'}
                    onCheckedChange={() => handleSelectChange('fuelType', 'all')}
                  />
                  <label htmlFor="fuel-all" className="text-sm text-gray-700">
                    Any Fuel Type
                  </label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />
          
          <AccordionItem value="engine" className="border-0">
            <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Engine Size</AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-2">
                <Select 
                  value={filters.engineSize?.toString() || 'all'} 
                  onValueChange={(value) => handleSelectChange('engineSize', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select engine size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Size</SelectItem>
                    <SelectItem value="1.0">Up to 1.0L</SelectItem>
                    <SelectItem value="1.5">1.0L - 1.5L</SelectItem>
                    <SelectItem value="2.0">1.5L - 2.0L</SelectItem>
                    <SelectItem value="2.5">2.0L - 2.5L</SelectItem>
                    <SelectItem value="3.0">2.5L - 3.0L</SelectItem>
                    <SelectItem value="4.0">3.0L - 4.0L</SelectItem>
                    <SelectItem value="5.0">Over 4.0L</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />
          
          <AccordionItem value="color" className="border-0">
            <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Color</AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-2 grid grid-cols-2 gap-2">
                {COLORS.map(color => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`color-${color}`} 
                      checked={filters.color === color}
                      onCheckedChange={() => handleSelectChange('color', color)}
                    />
                    <label htmlFor={`color-${color}`} className="text-sm text-gray-700">
                      {color}
                    </label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="color-all" 
                    checked={filters.color === 'all'}
                    onCheckedChange={() => handleSelectChange('color', 'all')}
                  />
                  <label htmlFor="color-all" className="text-sm text-gray-700">
                    Any Color
                  </label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />
          
          <AccordionItem value="features" className="border-0">
            <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Features</AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-2 grid grid-cols-1 gap-2">
                {FEATURES.map(feature => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`feature-${feature}`} 
                      checked={Array.isArray(filters.features) && filters.features.includes(feature)}
                      onCheckedChange={(checked) => handleCheckboxChange(feature, checked === true)}
                    />
                    <label htmlFor={`feature-${feature}`} className="text-sm text-gray-700">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />
          
          <AccordionItem value="seats" className="border-0">
            <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Number of Seats</AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-2 space-y-2">
                {SEATS.map(seat => (
                  <div key={seat} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`seat-${seat}`} 
                      checked={filters.seats === seat}
                      onCheckedChange={() => handleSelectChange('seats', seat)}
                    />
                    <label htmlFor={`seat-${seat}`} className="text-sm text-gray-700">
                      {seat} Seats
                    </label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="seats-all" 
                    checked={filters.seats === 'all'}
                    onCheckedChange={() => handleSelectChange('seats', 'all')}
                  />
                  <label htmlFor="seats-all" className="text-sm text-gray-700">
                    Any Seating
                  </label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
