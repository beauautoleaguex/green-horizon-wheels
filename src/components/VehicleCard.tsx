
import React from 'react';
import { Vehicle } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  // Normalize fuel type to one of the specified options
  const normalizedFuelType = (): string => {
    const fuelType = vehicle.fuelType.toLowerCase();
    if (fuelType.includes('petrol') || fuelType.includes('gas') || fuelType.includes('gasoline')) {
      return 'Petrol';
    } else if (fuelType.includes('electric')) {
      return 'Electric';
    } else if (fuelType.includes('hybrid')) {
      return 'Hybrid';
    } else if (fuelType.includes('diesel')) {
      return 'Diesel';
    }
    return 'Petrol'; // Default fallback
  };

  // Format weekly price (just for demo)
  const weeklyPrice = Math.round(vehicle.price / 52);

  return (
    <Card className="overflow-hidden hover:shadow transition-shadow duration-200 bg-white border border-gray-200">
      <div className="relative">
        {/* Vehicle Image */}
        <div className="relative pb-[60%]">
          <img 
            src={vehicle.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Vehicle+Image'} 
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Condition badge if new */}
          {vehicle.condition === 'New' && (
            <span className="absolute top-2 left-2 bg-brand-green text-white text-xs font-semibold px-2 py-1 rounded">
              NEW
            </span>
          )}
        </div>
        
        {/* Heart/favorite button */}
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        {/* Title and price section */}
        <div className="mb-1 flex justify-between items-start">
          <h3 className="text-base font-medium text-gray-900 line-clamp-1">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
        </div>
        
        {/* Vehicle Trim */}
        <p className="text-xs text-gray-500 mb-2">{vehicle.trim || 'Base Model'}</p>
        
        {/* Price information */}
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-brand-green font-bold text-lg">${vehicle.price.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Drive away</p>
            {vehicle.condition !== 'New' && (
              <p className="text-xs text-gray-500">Est. {vehicle.mileage.toLocaleString()} miles</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-brand-green font-semibold">${weeklyPrice}/week</p>
            <p className="text-xs text-gray-500">with finance</p>
          </div>
        </div>
        
        {/* Vehicle Specs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
          <span className="px-2 py-1 bg-gray-50 rounded">
            {normalizedFuelType()}
          </span>
          <span className="px-2 py-1 bg-gray-50 rounded">
            {vehicle.transmission}
          </span>
          <span className="px-2 py-1 bg-gray-50 rounded">
            {vehicle.bodyType}
          </span>
        </div>
      </div>
      
      {/* Card footer - view details button */}
      <div className="p-3 pt-0">
        <Button 
          className="w-full bg-white text-brand-green hover:bg-gray-50 border border-brand-green" 
          variant="outline"
        >
          View this car
        </Button>
      </div>
    </Card>
  );
};
