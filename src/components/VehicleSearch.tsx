
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchFilters } from './SearchFilters';
import { VehicleCard } from './VehicleCard';
import { Pagination } from './Pagination';
import { SortDropdown } from './SortDropdown';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { Vehicle } from '@/types/vehicle';
import { mockVehicles } from '@/data/mockVehicles';
import { 
  getVehicles, 
  initializeDatabase, 
  VehicleFilters, 
  SortOption,
  getVehicleMakes,
  getVehicleModels,
  getBodyTypes
} from '@/services/vehicleService';
import { toast } from '@/components/ui/use-toast';

export const VehicleSearch = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [sortOption, setSortOption] = useState<SortOption>({ column: 'id', order: 'asc' });
  const vehiclesPerPage = 12;
  
  // Initialize database with mock data on component mount
  useEffect(() => {
    initializeDatabase(mockVehicles).catch(console.error);
  }, []);

  // Fetch available filter options
  const { data: makes = [] } = useQuery({
    queryKey: ['vehicleMakes'],
    queryFn: () => getVehicleMakes(),
  });

  const { data: models = [] } = useQuery({
    queryKey: ['vehicleModels', filters.make],
    queryFn: () => getVehicleModels(filters.make),
  });

  const { data: bodyTypes = [] } = useQuery({
    queryKey: ['bodyTypes'],
    queryFn: () => getBodyTypes(),
  });

  // Fetch vehicles with filters and pagination
  const { 
    data: vehiclesData = { data: [], count: 0 },
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['vehicles', currentPage, vehiclesPerPage, filters, sortOption],
    queryFn: () => getVehicles(currentPage, vehiclesPerPage, filters, sortOption),
  });

  const { data: vehicles = [], count: totalVehicles = 0 } = vehiclesData;
  const totalPages = Math.ceil(totalVehicles / vehiclesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSort = (sortType: string) => {
    let newSortOption: SortOption;
    
    switch (sortType) {
      case 'price-asc':
        newSortOption = { column: 'price', order: 'asc' };
        break;
      case 'price-desc':
        newSortOption = { column: 'price', order: 'desc' };
        break;
      case 'year-desc':
        newSortOption = { column: 'year', order: 'desc' };
        break;
      case 'mileage-asc':
        newSortOption = { column: 'mileage', order: 'asc' };
        break;
      default:
        newSortOption = { column: 'id', order: 'asc' };
        break;
    }
    
    setSortOption(newSortOption);
  };

  const handleFilter = (newFilters: VehicleFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Show error toast if query fails
  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to load vehicles. Please try again later.",
        variant: "destructive"
      });
    }
  }, [isError]);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
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
            <SearchFilters 
              onFilter={handleFilter} 
              availableMakes={makes}
              availableModels={models}
              availableBodyTypes={bodyTypes}
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Browse Vehicles</h1>
                <p className="text-gray-500 mt-1">Showing {totalVehicles} results</p>
              </div>
              <div className="mt-3 sm:mt-0">
                <SortDropdown onSort={handleSort} />
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-100 animate-pulse rounded-lg h-64"></div>
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <h3 className="text-lg font-medium text-gray-900">No vehicles found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your filters for more results.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}

            {vehicles.length > 0 && (
              <div className="mt-8 mb-8">
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
      <Footer />
    </div>
  );
};
