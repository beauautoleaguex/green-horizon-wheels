
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { VehicleFilters } from '@/services/vehicleService';
import { MakeModelFilter } from './sections/MakeModelFilter';
import { PriceRangeFilter } from './sections/PriceRangeFilter';
import { YearFilter } from './sections/YearFilter';
import { BodyTypeFilter } from './sections/BodyTypeFilter';
import { ConditionFilter } from './sections/ConditionFilter';
import { MileageFilter } from './sections/MileageFilter';
import { TransmissionFilter } from './sections/TransmissionFilter';
import { FuelTypeFilter } from './sections/FuelTypeFilter';
import { EngineSizeFilter } from './sections/EngineSizeFilter';
import { ColorFilter } from './sections/ColorFilter';
import { FeaturesFilter } from './sections/FeaturesFilter';
import { SeatsFilter } from './sections/SeatsFilter';

interface FilterSectionsProps {
  filters: VehicleFilters;
  availableMakes: string[];
  availableModels: string[];
  availableBodyTypes: string[];
  onFilterChange: (filterKey: string, value: any) => void;
}

export const FilterSections: React.FC<FilterSectionsProps> = ({
  filters,
  availableMakes,
  availableModels,
  availableBodyTypes,
  onFilterChange
}) => {
  return (
    <Accordion type="single" collapsible defaultValue="make-model" className="space-y-0">
      <AccordionItem value="make-model" className="border-0">
        <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Make and Model</AccordionTrigger>
        <AccordionContent className="px-4">
          <MakeModelFilter 
            make={filters.make} 
            model={filters.model} 
            availableMakes={availableMakes} 
            availableModels={availableModels}
            onFilterChange={onFilterChange}
          />
        </AccordionContent>
      </AccordionItem>
      <Separator />
      
      <AccordionItem value="price" className="border-0">
        <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Price Range</AccordionTrigger>
        <AccordionContent className="px-4">
          <PriceRangeFilter 
            minPrice={filters.minPrice} 
            maxPrice={filters.maxPrice} 
            onFilterChange={onFilterChange} 
          />
        </AccordionContent>
      </AccordionItem>
      <Separator />
      
      <AccordionItem value="year" className="border-0">
        <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Year</AccordionTrigger>
        <AccordionContent className="px-4">
          <YearFilter 
            minYear={filters.minYear} 
            maxYear={filters.maxYear} 
            onFilterChange={onFilterChange} 
          />
        </AccordionContent>
      </AccordionItem>
      <Separator />
      
      <AccordionItem value="body-type" className="border-0">
        <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Body Type</AccordionTrigger>
        <AccordionContent className="px-4">
          <BodyTypeFilter 
            bodyType={filters.bodyType} 
            availableBodyTypes={availableBodyTypes}
            onFilterChange={onFilterChange} 
          />
        </AccordionContent>
      </AccordionItem>
      <Separator />
      
      <AccordionItem value="condition" className="border-0">
        <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Condition</AccordionTrigger>
        <AccordionContent className="px-4">
          <ConditionFilter 
            condition={filters.condition} 
            onFilterChange={onFilterChange} 
          />
        </AccordionContent>
      </AccordionItem>
      <Separator />
      
      <AccordionItem value="mileage" className="border-0">
        <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Mileage</AccordionTrigger>
        <AccordionContent className="px-4">
          <MileageFilter 
            minMileage={filters.minMileage} 
            maxMileage={filters.maxMileage} 
            onFilterChange={onFilterChange} 
          />
        </AccordionContent>
      </AccordionItem>
      <Separator />
      
      <AccordionItem value="transmission" className="border-0">
        <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Transmission</AccordionTrigger>
        <AccordionContent className="px-4">
          <TransmissionFilter 
            transmission={filters.transmission} 
            onFilterChange={onFilterChange} 
          />
        </AccordionContent>
      </AccordionItem>
      <Separator />
      
      <AccordionItem value="fuel-type" className="border-0">
        <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Fuel Type</AccordionTrigger>
        <AccordionContent className="px-4">
          <FuelTypeFilter 
            fuelType={filters.fuelType} 
            onFilterChange={onFilterChange} 
          />
        </AccordionContent>
      </AccordionItem>
      <Separator />
      
      <AccordionItem value="engine" className="border-0">
        <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Engine Size</AccordionTrigger>
        <AccordionContent className="px-4">
          <EngineSizeFilter 
            engineSize={filters.engineSize} 
            onFilterChange={onFilterChange} 
          />
        </AccordionContent>
      </AccordionItem>
      <Separator />
      
      <AccordionItem value="color" className="border-0">
        <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Color</AccordionTrigger>
        <AccordionContent className="px-4">
          <ColorFilter 
            color={filters.color} 
            onFilterChange={onFilterChange} 
          />
        </AccordionContent>
      </AccordionItem>
      <Separator />
      
      <AccordionItem value="features" className="border-0">
        <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Features</AccordionTrigger>
        <AccordionContent className="px-4">
          <FeaturesFilter 
            features={filters.features} 
            onFilterChange={onFilterChange} 
          />
        </AccordionContent>
      </AccordionItem>
      <Separator />
      
      <AccordionItem value="seats" className="border-0">
        <AccordionTrigger className="py-3 px-4 text-gray-800 font-medium">Number of Seats</AccordionTrigger>
        <AccordionContent className="px-4">
          <SeatsFilter 
            seats={filters.seats} 
            onFilterChange={onFilterChange} 
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
