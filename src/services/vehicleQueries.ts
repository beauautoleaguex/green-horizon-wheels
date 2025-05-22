
import { Vehicle } from '@/types/vehicle';
import { supabase, useSupabase, mockVehicleData } from './vehicleClient';
import { VehicleFilters, SortOption } from './vehicleTypes';

// Get vehicles with pagination and filters
export const getVehicles = async (
  page: number,
  limit: number,
  filters: VehicleFilters = {},
  sortOption: SortOption = { column: 'id', order: 'asc' }
): Promise<{ data: Vehicle[]; count: number }> => {
  console.log("getVehicles called with page:", page, "limit:", limit, "filters:", filters);
  
  // If Supabase is configured and available, use it
  if (useSupabase && supabase) {
    try {
      let query = supabase
        .from('vehicles')
        .select('*', { count: 'exact' });

      if (filters.make) {
        query = query.eq('make', filters.make);
      }
      if (filters.model) {
        query = query.eq('model', filters.model);
      }
      if (filters.bodyType) {
        query = query.eq('body_type', filters.bodyType);
      }
      if (filters.minYear) {
        query = query.gte('year', filters.minYear);
      }
      if (filters.maxYear) {
        query = query.lte('year', filters.maxYear);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.transmission) {
        query = query.eq('transmission', filters.transmission);
      }
      if (filters.fuelType) {
        query = query.eq('fuel_type', filters.fuelType);
      }

      if (filters.color) {
        query = query.eq('exterior_color', filters.color);
      }

      if (filters.engineSize) {
        query = query.eq('engine_size', filters.engineSize);
      }

      if (filters.features && filters.features.length > 0) {
        filters.features.forEach(feature => {
          query = query.like('features', `%${feature}%`);
        });
      }

      if (filters.seats) {
        query = query.eq('seats', filters.seats);
      }

      if (filters.condition && filters.condition !== 'all') {
        query = query.eq('condition', filters.condition);
      }

      if (filters.minMileage !== undefined) {
        query = query.gte('mileage', filters.minMileage!);
      }

      if (filters.maxMileage !== undefined) {
        query = query.lte('mileage', filters.maxMileage!);
      }

      // Add support for the search field
      if (filters.search && filters.search.trim() !== '') {
        query = query.or(`make.ilike.%${filters.search}%,model.ilike.%${filters.search}%`);
      }
        
      query = query.order(sortOption.column, { ascending: sortOption.order === 'asc' });

      const startIndex = (page - 1) * limit;
      query = query.range(startIndex, startIndex + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching vehicles from Supabase:", error);
        // Fall back to mock data if Supabase fails
        return _getVehiclesFromMock(page, limit, filters, sortOption);
      }

      console.log("Fetched data from Supabase:", data?.length, "vehicles");
      return { data: data as Vehicle[], count: count || 0 };
    } catch (error) {
      console.error("Failed to fetch vehicles from Supabase:", error);
      // Fall back to mock data if Supabase fails
      return _getVehiclesFromMock(page, limit, filters, sortOption);
    }
  } else {
    // If Supabase is not configured, use mock data
    console.log("Using mock data for getVehicles");
    return _getVehiclesFromMock(page, limit, filters, sortOption);
  }
};

// Mock implementation for local testing
export const _getVehiclesFromMock = (
  page: number,
  limit: number,
  filters: VehicleFilters = {},
  sortOption: SortOption = { column: 'id', order: 'asc' }
): { data: Vehicle[]; count: number } => {
  console.log("_getVehiclesFromMock called with mockVehicleData.length:", mockVehicleData.length);
  
  // Check if we have data
  if (mockVehicleData.length === 0) {
    console.warn("No mock vehicle data available!");
    return { data: [], count: 0 };
  }
  
  // We'll use mockVehicleData directly now
  let filteredData = [...mockVehicleData];
  console.log("Starting filter with", filteredData.length, "vehicles");
  
  // Handle the "all" values correctly for string-based filters
  if (filters.make && filters.make !== 'all') {
    filteredData = filteredData.filter(v => v.make === filters.make);
    console.log(`After make filter (${filters.make}):`, filteredData.length);
  }
  
  if (filters.model && filters.model !== 'all') {
    filteredData = filteredData.filter(v => v.model === filters.model);
    console.log(`After model filter (${filters.model}):`, filteredData.length);
  }
  
  if (filters.bodyType && filters.bodyType !== 'all') {
    filteredData = filteredData.filter(v => v.bodyType === filters.bodyType);
    console.log(`After bodyType filter (${filters.bodyType}):`, filteredData.length);
  }
  
  if (filters.minYear) {
    filteredData = filteredData.filter(v => v.year >= filters.minYear!);
    console.log(`After minYear filter (${filters.minYear}):`, filteredData.length);
  }
  
  if (filters.maxYear) {
    filteredData = filteredData.filter(v => v.year <= filters.maxYear!);
    console.log(`After maxYear filter (${filters.maxYear}):`, filteredData.length);
  }
  
  if (filters.minPrice) {
    filteredData = filteredData.filter(v => v.price >= filters.minPrice!);
    console.log(`After minPrice filter (${filters.minPrice}):`, filteredData.length);
  }
  
  if (filters.maxPrice) {
    filteredData = filteredData.filter(v => v.price <= filters.maxPrice!);
    console.log(`After maxPrice filter (${filters.maxPrice}):`, filteredData.length);
  }
  
  if (filters.transmission && filters.transmission !== 'all') {
    filteredData = filteredData.filter(v => v.transmission === filters.transmission);
    console.log(`After transmission filter (${filters.transmission}):`, filteredData.length);
  }
  
  if (filters.fuelType && filters.fuelType !== 'all') {
    filteredData = filteredData.filter(v => v.fuelType === filters.fuelType);
    console.log(`After fuelType filter (${filters.fuelType}):`, filteredData.length);
  }
  
  if (filters.color && filters.color !== 'all') {
    filteredData = filteredData.filter(v => v.exteriorColor === filters.color);
    console.log(`After color filter (${filters.color}):`, filteredData.length);
  }
  
  if (filters.engineSize && filters.engineSize !== 'all') {
    filteredData = filteredData.filter(v => v.engineSize === filters.engineSize);
    console.log(`After engineSize filter (${filters.engineSize}):`, filteredData.length);
  }
  
  if (filters.features && filters.features.length > 0) {
    filteredData = filteredData.filter(v =>
      v.features && filters.features!.every(feature => v.features.includes(feature))
    );
    console.log(`After features filter (${filters.features}):`, filteredData.length);
  }
  
  if (filters.seats && filters.seats !== 'all') {
    filteredData = filteredData.filter(v => v.seats === filters.seats);
    console.log(`After seats filter (${filters.seats}):`, filteredData.length);
  }

  if (filters.condition && filters.condition !== 'all') {
    filteredData = filteredData.filter(v => v.condition === filters.condition);
    console.log(`After condition filter (${filters.condition}):`, filteredData.length);
  }

  if (filters.minMileage !== undefined) {
    filteredData = filteredData.filter(v => v.mileage >= filters.minMileage!);
    console.log(`After minMileage filter (${filters.minMileage}):`, filteredData.length);
  }

  if (filters.maxMileage !== undefined) {
    filteredData = filteredData.filter(v => v.mileage <= filters.maxMileage!);
    console.log(`After maxMileage filter (${filters.maxMileage}):`, filteredData.length);
  }
  
  // Add support for the search field
  if (filters.search && filters.search.trim() !== '') {
    const searchTerm = filters.search.toLowerCase();
    filteredData = filteredData.filter(v => 
      v.make.toLowerCase().includes(searchTerm) ||
      v.model.toLowerCase().includes(searchTerm) ||
      (v.features && v.features.some(feature => feature.toLowerCase().includes(searchTerm)))
    );
    console.log(`After search filter (${filters.search}):`, filteredData.length);
  }
  
  // Apply sorting first
  filteredData.sort((a, b) => {
    const column = sortOption.column;
    const order = sortOption.order;

    let aValue = a[column as keyof Vehicle];
    let bValue = b[column as keyof Vehicle];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase() as any;
      bValue = bValue.toLowerCase() as any;
    }

    if (aValue === undefined || aValue === null) return order === 'asc' ? -1 : 1;
    if (bValue === undefined || bValue === null) return order === 'asc' ? 1 : -1;

    if (aValue < bValue) {
      return order === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Then apply pagination
  const startIndex = (page - 1) * limit;
  const paginatedData = filteredData.slice(startIndex, startIndex + limit);
  
  console.log("Filtered data:", filteredData.length, "Paginated data:", paginatedData.length);

  // Return the paginated data and the total count for pagination controls
  return { data: paginatedData, count: filteredData.length };
};
