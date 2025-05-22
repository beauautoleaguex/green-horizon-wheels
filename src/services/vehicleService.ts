
import { supabase } from '@/lib/supabase';
import { Vehicle } from '@/types/vehicle';

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

// Get vehicles with pagination and filters
export async function getVehicles(
  page = 1,
  pageSize = 12,
  filters: VehicleFilters = {},
  sort?: SortOption
): Promise<{ data: Vehicle[], count: number }> {
  try {
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
    return { data: [], count: 0 };
  }
}

// Get available vehicle makes for filters
export async function getVehicleMakes(): Promise<string[]> {
  try {
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
    return [];
  }
}

// Get available vehicle models for a specific make
export async function getVehicleModels(make?: string): Promise<string[]> {
  try {
    let query = supabase.from('vehicles').select('model');
    
    if (make && make !== 'all') {
      query = query.eq('make', make);
    }
    
    const { data, error } = await query.order('model');
    
    if (error) throw error;
    
    // Get unique models
    const uniqueModels = [...new Set(data.map(item => item.model))];
    return uniqueModels;
  } catch (error) {
    console.error('Error fetching vehicle models:', error);
    return [];
  }
}

// Get all vehicle body types
export async function getBodyTypes(): Promise<string[]> {
  try {
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
    return [];
  }
}

// Initialize the database with mock data if empty
export async function initializeDatabase(mockVehicles: Vehicle[]): Promise<void> {
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
