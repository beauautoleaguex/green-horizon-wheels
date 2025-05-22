
import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";

interface SearchFiltersProps {
  onFilter: (filters: any) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    make: 'all',
    model: 'all',
    minPrice: 0,
    maxPrice: 200000,
    minYear: 2000,
    maxYear: new Date().getFullYear(),
    bodyType: 'all',
    condition: 'all',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
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

  const applyFilters = () => {
    onFilter(filters);
  };

  const resetFilters = () => {
    setFilters({
      make: 'all',
      model: 'all',
      minPrice: 0,
      maxPrice: 200000,
      minYear: 2000,
      maxYear: new Date().getFullYear(),
      bodyType: 'all',
      condition: 'all',
    });
    onFilter({
      make: 'all',
      model: 'all',
      minPrice: 0,
      maxPrice: 200000,
      minYear: 2000,
      maxYear: new Date().getFullYear(),
      bodyType: 'all',
      condition: 'all',
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
          <select
            name="make"
            value={filters.make}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
          >
            <option value="all">All Makes</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Ford">Ford</option>
            <option value="Tesla">Tesla</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes">Mercedes-Benz</option>
            <option value="Audi">Audi</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <select
            name="model"
            value={filters.model}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
          >
            <option value="all">All Models</option>
            <option value="Camry">Camry</option>
            <option value="Corolla">Corolla</option>
            <option value="Civic">Civic</option>
            <option value="Accord">Accord</option>
            <option value="F-150">F-150</option>
            <option value="Mustang">Mustang</option>
            <option value="Model 3">Model 3</option>
            <option value="Model Y">Model Y</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range: ${filters.minPrice.toLocaleString()} - ${filters.maxPrice.toLocaleString()}
          </label>
          <div className="py-4 px-1">
            <Slider 
              defaultValue={[filters.minPrice, filters.maxPrice]} 
              min={0} 
              max={200000} 
              step={5000}
              onValueChange={handlePriceRangeChange}
              className="w-full"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year: {filters.minYear} - {filters.maxYear}
          </label>
          <div className="py-4 px-1">
            <Slider 
              defaultValue={[filters.minYear, filters.maxYear]} 
              min={2000} 
              max={new Date().getFullYear()} 
              step={1}
              onValueChange={handleYearRangeChange}
              className="w-full"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
          <select
            name="bodyType"
            value={filters.bodyType}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
          >
            <option value="all">All Types</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Coupe">Coupe</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Convertible">Convertible</option>
            <option value="Van">Van</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
          <select
            name="condition"
            value={filters.condition}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
          >
            <option value="all">All Conditions</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Certified Pre-Owned">Certified Pre-Owned</option>
          </select>
        </div>
        
        <div className="flex flex-col space-y-2 pt-3">
          <button
            onClick={applyFilters}
            className="w-full bg-brand-green hover:bg-brand-dark text-white py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
