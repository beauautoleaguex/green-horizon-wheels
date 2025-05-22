
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { 
  VehicleFilters, 
  SortOption, 
  getVehicles, 
  initializeDatabase, 
  getVehicleMakes, 
  getVehicleModels, 
  getBodyTypes 
} from '@/services/vehicleService';
import { mockVehicles } from '@/data/mockVehicles';

export const useVehicleSearch = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const vehiclesPerPage = 48;
  
  const [filters, setFilters] = useState<VehicleFilters>({
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
    search: ''
  });
  
  const [sortOption, setSortOption] = useState<SortOption>({ column: 'id', order: 'asc' });

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
  console.log("Vehicles data:", vehicles.length, "Total:", totalVehicles);

  const totalPages = Math.ceil(totalVehicles / vehiclesPerPage);

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
    console.log("Handling new filters:", newFilters);
    setFilters(prev => ({
      ...newFilters,
      search: prev.search // Preserve search value
    }));
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted with query:", searchQuery);
    setFilters(prev => ({
      ...prev,
      search: searchQuery
    }));
    setCurrentPage(1);
    refetch();
  };

  return {
    currentPage,
    isFilterOpen,
    setIsFilterOpen,
    filters,
    searchQuery,
    setSearchQuery,
    makes,
    models,
    bodyTypes,
    vehicles,
    totalVehicles,
    totalPages,
    isLoading,
    isInitialized,
    handlePageChange,
    handleSort,
    handleFilter,
    handleSearch
  };
};
