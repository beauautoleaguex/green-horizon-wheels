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
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const VehicleSearch = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [sortOption, setSortOption] = useState<SortOption>({ column: 'id', order: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const vehiclesPerPage = 48;
  
  // Initialize database with mock data on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log(`Initializing database with ${mockVehicles.length} vehicles`);
        await initializeDatabase(mockVehicles);
        console.log("Database initialization completed successfully");
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize database:", error);
        // Even if there's an error, we'll set initialized to true so queries can run
        // This allows the mock data fallback to work
        setIsInitialized(true);
        toast({
          title: "Warning",
          description: "Using local data - could not connect to database",
          variant: "destructive"
        });
      }
    };
    
    initialize();
  }, []);

  console.log("Is initialized:", isInitialized); // Debug log

  // Fetch available filter options
  const { data: makes = [] } = useQuery({
    queryKey: ['vehicleMakes'],
    queryFn: getVehicleMakes,
    enabled: isInitialized,
  });

  const { data: models = [] } = useQuery({
    queryKey: ['vehicleModels', filters.make],
    queryFn: () => getVehicleModels(filters.make),
    enabled: isInitialized && filters.make !== undefined,
  });

  const { data: bodyTypes = [] } = useQuery({
    queryKey: ['bodyTypes'],
    queryFn: getBodyTypes,
    enabled: isInitialized,
  });

  // Fetch vehicles with filters and pagination
  const { 
    data: vehiclesData = { data: [], count: 0 },
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['vehicles', currentPage, vehiclesPerPage, filters, sortOption, searchQuery],
    queryFn: () => getVehicles(currentPage, vehiclesPerPage, { ...filters, search: searchQuery }, sortOption),
    enabled: isInitialized,
  });

  // Force a refetch when initialization completes
  useEffect(() => {
    if (isInitialized) {
      console.log("Fetching vehicles with filters:", filters);
      refetch();
    }
  }, [isInitialized, refetch]);

  const { data: vehicles = [], count: totalVehicles = 0 } = vehiclesData;
  console.log("Vehicles data:", vehicles.length, "Total:", totalVehicles); // Debug log

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
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
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navigation />
      <div className="w-full mx-auto px-0 py-0 flex-grow">
        <div className="flex flex-col md:flex-row">
          {/* Search bar - visible on all screen sizes */}
          <div className="w-full md:hidden px-4 py-4 bg-white">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input 
                  className="pl-10 rounded-md border border-gray-300 w-full"
                  placeholder="Search makes, models, or keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="bg-[#F1F0FB] hover:bg-gray-200"
              >
                <Search className="h-5 w-5 text-[#8E9196]" />
              </Button>
            </form>
          </div>

          {/* Mobile filter toggle */}
          <button 
            className="md:hidden flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-4 mx-4 mt-0"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm1 5a1 1 0 100 2h16a1 1 0 100-2H4z" />
            </svg>
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filters sidebar - fixed position and width on desktop */}
          <div className={`md:sticky md:top-0 md:h-screen md:w-72 md:flex-shrink-0 md:overflow-y-auto md:bg-white md:shadow-sm md:block ${isFilterOpen ? 'block' : 'hidden'}`}>
            {/* Search bar on desktop - above filters */}
            <div className="hidden md:block p-4 border-b border-gray-100">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input 
                    className="pl-10 rounded-md border border-gray-300 w-full"
                    placeholder="Search makes, models, or keywords"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="bg-[#F1F0FB] hover:bg-gray-200"
                >
                  <Search className="h-5 w-5 text-[#8E9196]" />
                </Button>
              </form>
            </div>
            <SearchFilters 
              onFilter={setFilters} 
              availableMakes={makes}
              availableModels={models}
              availableBodyTypes={bodyTypes}
            />
          </div>

          {/* Main content area */}
          <div className="flex-1 w-full bg-slate-50">
            <div className="flex flex-col px-4 md:px-8 py-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  <p className="text-gray-900 font-medium">{totalVehicles} vehicles for sale in Australia</p>
                </div>
                <div className="mt-3 sm:mt-0">
                  <SortDropdown onSort={handleSort} />
                </div>
              </div>
            
              {!isInitialized ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-gray-100 animate-pulse rounded-md h-64"></div>
                  ))}
                </div>
              ) : isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-gray-100 animate-pulse rounded-md h-64"></div>
                  ))}
                </div>
              ) : vehicles.length === 0 ? (
                <div className="bg-white p-8 rounded-md shadow-sm border border-gray-200 text-center">
                  <h3 className="text-lg font-medium text-gray-900">No vehicles found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your filters for more results.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 animate-fade-in">
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
      </div>
      <Footer />
    </div>
  );
};
