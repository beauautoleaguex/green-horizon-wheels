
import React, { useState } from 'react';
import { SearchFilters } from './SearchFilters';
import { VehicleCard } from './VehicleCard';
import { Pagination } from './Pagination';
import { SortDropdown } from './SortDropdown';
import { Navigation } from './Navigation';
import { Vehicle } from '@/types/vehicle';
import { mockVehicles } from '@/data/mockVehicles';

export const VehicleSearch = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const vehiclesPerPage = 12;

  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = vehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  
  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSort = (sortType: string) => {
    let sortedVehicles = [...vehicles];
    
    switch (sortType) {
      case 'price-asc':
        sortedVehicles.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedVehicles.sort((a, b) => b.price - a.price);
        break;
      case 'year-desc':
        sortedVehicles.sort((a, b) => b.year - a.year);
        break;
      case 'mileage-asc':
        sortedVehicles.sort((a, b) => a.mileage - b.mileage);
        break;
      default:
        break;
    }
    
    setVehicles(sortedVehicles);
  };

  const handleFilter = (filters: any) => {
    let filteredVehicles = [...mockVehicles];
    
    if (filters.make && filters.make !== 'all') {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.make === filters.make);
    }
    
    if (filters.model && filters.model !== 'all') {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.model === filters.model);
    }

    if (filters.minPrice) {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.price >= filters.minPrice);
    }

    if (filters.maxPrice) {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.price <= filters.maxPrice);
    }

    if (filters.minYear) {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.year >= filters.minYear);
    }

    if (filters.maxYear) {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.year <= filters.maxYear);
    }

    if (filters.bodyType && filters.bodyType !== 'all') {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.bodyType === filters.bodyType);
    }

    if (filters.condition && filters.condition !== 'all') {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.condition === filters.condition);
    }

    setVehicles(filteredVehicles);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile filter toggle */}
          <button 
            className="md:hidden flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-4"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm1 5a1 1 0 100 2h16a1 1 0 100-2H4z" />
            </svg>
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filters sidebar - hidden on mobile unless toggled */}
          <div className={`w-full md:w-64 md:block ${isFilterOpen ? 'block' : 'hidden'}`}>
            <SearchFilters onFilter={handleFilter} />
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Browse Vehicles</h1>
                <p className="text-gray-500 mt-1">Showing {vehicles.length} results</p>
              </div>
              <div className="mt-3 sm:mt-0">
                <SortDropdown onSort={handleSort} />
              </div>
            </div>

            {vehicles.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <h3 className="text-lg font-medium text-gray-900">No vehicles found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your filters for more results.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {currentVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}

            {vehicles.length > 0 && (
              <div className="mt-8">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
