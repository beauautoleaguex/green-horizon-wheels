import { createClient } from '@supabase/supabase-js';
import { Vehicle } from '@/types/vehicle';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export interface VehicleFilters {
  make?: string;
  model?: string;
  bodyType?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  transmission?: string;
  fuelType?: string;
  color?: string;
  engineSize?: string;
  features?: string[];
  seats?: string;
  search?: string; // Add the search property to fix the TypeScript error
}

export interface SortOption {
  column: string;
  order: 'asc' | 'desc';
}

// Initialize the database with mock vehicles
export const initializeDatabase = async (vehicles: Vehicle[]): Promise<void> => {
  try {
    // Check if the vehicles table is empty
    const { data, error, count } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error("Error checking vehicles table:", error);
      throw error;
    }

    if (count === 0) {
      // If the table is empty, insert the mock vehicles
      const { error: insertError } = await supabase
        .from('vehicles')
        .insert(vehicles);

      if (insertError) {
        console.error("Error inserting mock vehicles:", insertError);
        throw insertError;
      }

      console.log("Database initialized with mock vehicles.");
    } else {
      console.log("Database already contains vehicles. Skipping initialization.");
    }
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

// Get unique vehicle makes
export const getVehicleMakes = async (): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from('vehicles')
            .select('make')
            .distinct()
            .order('make', { ascending: true });

        if (error) {
            console.error("Error fetching vehicle makes:", error);
            return [];
        }

        return data.map(item => item.make);
    } catch (error) {
        console.error("Failed to fetch vehicle makes:", error);
        return [];
    }
};

// Get vehicle models by make
export const getVehicleModels = async (make?: string): Promise<string[]> => {
    try {
        let query = supabase
            .from('vehicles')
            .select('model')
            .distinct()
            .order('model', { ascending: true });

        if (make) {
            query = query.eq('make', make);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching vehicle models:", error);
            return [];
        }

        return data.map(item => item.model);
    } catch (error) {
        console.error("Failed to fetch vehicle models:", error);
        return [];
    }
};

// Get unique body types
export const getBodyTypes = async (): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from('vehicles')
            .select('body_type')
            .distinct()
            .order('body_type', { ascending: true });

        if (error) {
            console.error("Error fetching body types:", error);
            return [];
        }

        return data.map(item => item.body_type);
    } catch (error) {
        console.error("Failed to fetch body types:", error);
        return [];
    }
};

// Get vehicles with pagination and filters
export const getVehicles = async (
  page: number,
  limit: number,
  filters: VehicleFilters = {},
  sortOption: SortOption = { column: 'id', order: 'asc' }
): Promise<{ data: Vehicle[]; count: number }> => {
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

  // Add support for the search field
  if (filters.search && filters.search.trim() !== '') {
    query = query.or(`make.ilike.%${filters.search}%,model.ilike.%${filters.search}%`);
  }
    
  query = query.order(sortOption.column, { ascending: sortOption.order === 'asc' });

  const startIndex = (page - 1) * limit;
  query = query.range(startIndex, startIndex + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching vehicles:", error);
    return { data: [], count: 0 };
  }

  return { data: data as Vehicle[], count: count || 0 };
};

// Mock implementation for local testing
export const _getVehiclesFromMock = (
  page: number,
  limit: number,
  filters: VehicleFilters = {},
  sortOption: SortOption = { column: 'id', order: 'asc' }
): { data: Vehicle[]; count: number } => {
  let filteredData = [...Array(100)].map((_, i) => ({
    id: i + 1,
    make: `Make ${i % 10}`,
    model: `Model ${i % 5}`,
    year: 2010 + (i % 12),
    price: 15000 + (i * 1000),
    body_type: ['Sedan', 'SUV', 'Truck', 'Hatchback'][i % 4],
    transmission: ['Automatic', 'Manual'][i % 2],
    fuel_type: ['Gasoline', 'Diesel', 'Electric'][i % 3],
    exteriorColor: ['Red', 'Blue', 'White', 'Black'][i % 4],
    engineSize: `${2.0 + (i % 3) * 0.5}L`,
    features: ['Navigation', 'Sunroof', 'Leather Seats'],
    mileage: 50000 + (i * 5000),
    images: [],
    description: '',
    registration_date: new Date(),
    owners: 1,
    vin: '',
    is_new: true,
    seats: '5',
    // Add other properties as needed
  }));

  if (filters.make) {
    filteredData = filteredData.filter(v => v.make === filters.make);
  }
  if (filters.model) {
    filteredData = filteredData.filter(v => v.model === filters.model);
  }
  if (filters.bodyType) {
    filteredData = filteredData.filter(v => v.body_type === filters.bodyType);
  }
  if (filters.minYear) {
    filteredData = filteredData.filter(v => v.year >= filters.minYear);
  }
  if (filters.maxYear) {
    filteredData = filteredData.filter(v => v.year <= filters.maxYear);
  }
  if (filters.minPrice) {
    filteredData = filteredData.filter(v => v.price >= filters.minPrice);
  }
  if (filters.maxPrice) {
    filteredData = filteredData.filter(v => v.price <= filters.maxPrice);
  }
  if (filters.transmission) {
    filteredData = filteredData.filter(v => v.transmission === filters.transmission);
  }
  if (filters.fuelType) {
    filteredData = filteredData.filter(v => v.fuel_type === filters.fuelType);
  }
  
  if (filters.color && filters.color !== 'all') {
    filteredData = filteredData.filter(v => v.exteriorColor === filters.color);
  }
  
  if (filters.engineSize) {
    filteredData = filteredData.filter(v => v.engineSize === filters.engineSize);
  }
  
  if (filters.features && filters.features.length > 0) {
    filteredData = filteredData.filter(v =>
      v.features && filters.features.every(feature => v.features.includes(feature))
    );
  }
  
  if (filters.seats) {
    filteredData = filteredData.filter(v => v.seats === filters.seats);
  }
  
  // Add support for the search field
  if (filters.search && filters.search.trim() !== '') {
    const searchTerm = filters.search.toLowerCase();
    filteredData = filteredData.filter(v => 
      v.make.toLowerCase().includes(searchTerm) ||
      v.model.toLowerCase().includes(searchTerm) ||
      (v.features && v.features.some(feature => feature.toLowerCase().includes(searchTerm)))
    );
  }
  
  const startIndex = (page - 1) * limit;
  const paginatedData = filteredData.slice(startIndex, startIndex + limit);

  // Apply sorting
  paginatedData.sort((a, b) => {
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

  return { data: paginatedData, count: filteredData.length };
};

export const getAllColors = async (): Promise<string[]> => {
  try {
      const { data, error } = await supabase
          .from('vehicles')
          .select('exterior_color')
          .distinct()
          .order('exterior_color', { ascending: true });

      if (error) {
          console.error("Error fetching colors:", error);
          return [];
      }

      return data.map(item => item.exterior_color);
  } catch (error) {
      console.error("Failed to fetch colors:", error);
      return [];
  }
};
