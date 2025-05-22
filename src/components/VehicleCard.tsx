
import React from 'react';
import { Vehicle } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
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

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative pb-[60%]">
        <img 
          src={vehicle.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Vehicle+Image'} 
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {vehicle.condition === 'New' && (
          <span className="absolute top-2 left-2 bg-brand-green text-white text-xs font-semibold px-2 py-1 rounded">
            NEW
          </span>
        )}
      </div>
      
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-medium text-gray-900 truncate">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className="text-brand-green font-semibold text-lg mt-1">${vehicle.price.toLocaleString()}</p>
        
        <div className="mt-2 text-sm text-gray-500">
          <div className="flex justify-between mt-1">
            <span>{vehicle.mileage.toLocaleString()} miles</span>
            <span>{vehicle.transmission}</span>
          </div>
          
          <div className="flex justify-between mt-1">
            <span>{normalizedFuelType()}</span>
            <span>{vehicle.bodyType}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-brand-green hover:bg-brand-dark text-white">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
