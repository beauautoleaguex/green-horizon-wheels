
import React from 'react';
import { VehicleCard } from '../VehicleCard';
import { Vehicle } from '@/types/vehicle';
import { Image } from 'lucide-react';

interface VehicleGridProps {
  vehicles: Vehicle[];
  isInitialized: boolean;
  isLoading: boolean;
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({ 
  vehicles, 
  isInitialized, 
  isLoading 
}) => {
  if (!isInitialized) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-gray-100 animate-pulse rounded-md h-64"></div>
        ))}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-gray-100 animate-pulse rounded-md h-64"></div>
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="bg-white p-8 rounded-md shadow-sm border border-gray-200 text-center">
        <h3 className="text-lg font-medium text-gray-900">No vehicles found</h3>
        <p className="mt-1 text-gray-500">Try adjusting your filters for more results.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 animate-fade-in">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
};
