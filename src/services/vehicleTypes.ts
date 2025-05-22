
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
  search?: string;
  condition?: string;
  minMileage?: number;
  maxMileage?: number;
}

export interface SortOption {
  column: string;
  order: 'asc' | 'desc';
}
