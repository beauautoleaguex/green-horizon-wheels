import { supabase } from '@/lib/supabase';
import { Vehicle } from '@/types/vehicle';
import { mockVehicles } from '@/data/mockVehicles';

// Define search filter types
export interface VehicleFilters {
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  bodyType?: string;
  condition?: string;
}

export interface SortOption {
  column: string;
  order: 'asc' | 'desc';
}

// Check if we're using mock Supabase
const isMockSupabase = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

// Get vehicles with pagination and filters
export async function getVehicles(
  page = 1,
  pageSize = 12,
  filters: VehicleFilters = {},
  sort?: SortOption
): Promise<{ data: Vehicle[], count: number }> {
  try {
    // Use mock data if we're in development without Supabase credentials
    if (isMockSupabase) {
      console.log('Using mock vehicle data');
      return getMockVehicles(page, pageSize, filters, sort);
    }

    // Start building the query
    let query = supabase.from('vehicles').select('*', { count: 'exact' });
    
    // Apply filters
    if (filters.make && filters.make !== 'all') {
      query = query.eq('make', filters.make);
    }
    
    if (filters.model && filters.model !== 'all') {
      query = query.eq('model', filters.model);
    }
    
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    
    if (filters.minYear) {
      query = query.gte('year', filters.minYear);
    }
    
    if (filters.maxYear) {
      query = query.lte('year', filters.maxYear);
    }
    
    if (filters.bodyType && filters.bodyType !== 'all') {
      query = query.eq('bodyType', filters.bodyType);
    }
    
    if (filters.condition && filters.condition !== 'all') {
      query = query.eq('condition', filters.condition);
    }
    
    // Apply sorting
    if (sort) {
      query = query.order(sort.column, { ascending: sort.order === 'asc' });
    }
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return { 
      data: data as Vehicle[], 
      count: count || 0 
    };
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    
    // Fallback to mock data on error
    return getMockVehicles(page, pageSize, filters, sort);
  }
}

// Mock implementation using mock data
function getMockVehicles(
  page = 1,
  pageSize = 12,
  filters: VehicleFilters = {},
  sort?: SortOption
): Promise<{ data: Vehicle[], count: number }> {
  return new Promise(resolve => {
    let filteredData = [...mockVehicles];
    
    // Apply filters
    if (filters.make && filters.make !== 'all') {
      filteredData = filteredData.filter(v => v.make === filters.make);
    }
    
    if (filters.model && filters.model !== 'all') {
      filteredData = filteredData.filter(v => v.model === filters.model);
    }
    
    if (filters.minPrice) {
      filteredData = filteredData.filter(v => v.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice) {
      filteredData = filteredData.filter(v => v.price <= filters.maxPrice!);
    }
    
    if (filters.minYear) {
      filteredData = filteredData.filter(v => v.year >= filters.minYear!);
    }
    
    if (filters.maxYear) {
      filteredData = filteredData.filter(v => v.year <= filters.maxYear!);
    }
    
    if (filters.bodyType && filters.bodyType !== 'all') {
      filteredData = filteredData.filter(v => v.bodyType === filters.bodyType);
    }
    
    if (filters.condition && filters.condition !== 'all') {
      filteredData = filteredData.filter(v => v.condition === filters.condition);
    }
    
    // Apply sorting
    if (sort) {
      filteredData.sort((a, b) => {
        const aValue = a[sort.column as keyof Vehicle];
        const bValue = b[sort.column as keyof Vehicle];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sort.order === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sort.order === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        return 0;
      });
    }
    
    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
    
    resolve({
      data: paginatedData,
      count: filteredData.length
    });
  });
}

// Get available vehicle makes for filters
export async function getVehicleMakes(): Promise<string[]> {
  try {
    if (isMockSupabase) {
      const uniqueMakes = [...new Set(mockVehicles.map(item => item.make))];
      return uniqueMakes;
    }

    const { data, error } = await supabase
      .from('vehicles')
      .select('make')
      .order('make');
    
    if (error) throw error;
    
    // Get unique makes
    const uniqueMakes = [...new Set(data.map(item => item.make))];
    return uniqueMakes;
  } catch (error) {
    console.error('Error fetching vehicle makes:', error);
    // Fallback to mock data
    return [...new Set(mockVehicles.map(item => item.make))];
  }
}

// Get available vehicle models for a specific make
export async function getVehicleModels(make?: string): Promise<string[]> {
  try {
    if (isMockSupabase) {
      let filteredVehicles = [...mockVehicles];
      if (make && make !== 'all') {
        filteredVehicles = filteredVehicles.filter(v => v.make === make);
      }
      return [...new Set(filteredVehicles.map(item => item.model))];
    }

    const { data, error } = await supabase
      .from('vehicles')
      .select('model')
      .order('model');
    
    if (error) throw error;
    
    // Get unique models
    const uniqueModels = [...new Set(data.map(item => item.model))];
    return uniqueModels;
  } catch (error) {
    console.error('Error fetching vehicle models:', error);
    // Fallback to mock data
    let filteredVehicles = [...mockVehicles];
    if (make && make !== 'all') {
      filteredVehicles = filteredVehicles.filter(v => v.make === make);
    }
    return [...new Set(filteredVehicles.map(item => item.model))];
  }
}

// Get all vehicle body types
export async function getBodyTypes(): Promise<string[]> {
  try {
    if (isMockSupabase) {
      return [...new Set(mockVehicles.map(item => item.bodyType))];
    }

    const { data, error } = await supabase
      .from('vehicles')
      .select('bodyType')
      .order('bodyType');
    
    if (error) throw error;
    
    // Get unique body types
    const uniqueBodyTypes = [...new Set(data.map(item => item.bodyType))];
    return uniqueBodyTypes;
  } catch (error) {
    console.error('Error fetching body types:', error);
    // Fallback to mock data
    return [...new Set(mockVehicles.map(item => item.bodyType))];
  }
}

// Initialize the database with mock data if empty
export async function initializeDatabase(mockVehicles: Vehicle[]): Promise<void> {
  // Skip initialization if using mock Supabase
  if (isMockSupabase) {
    console.log('Mock environment detected, skipping database initialization');
    return;
  }

  try {
    // Check if we have any vehicles
    const { count, error: countError } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    // If no vehicles exist, insert mock data
    if (count === 0) {
      const { error } = await supabase
        .from('vehicles')
        .insert(mockVehicles);
      
      if (error) throw error;
      console.log('Initialized database with mock vehicles');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
