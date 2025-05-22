
import React from 'react';
import { Vehicle } from '@/types/vehicle';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
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
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-brand-green font-semibold">${vehicle.price.toLocaleString()}</p>
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          <div className="flex justify-between mt-1">
            <span>{vehicle.mileage.toLocaleString()} miles</span>
            <span>{vehicle.transmission}</span>
          </div>
          
          <div className="flex justify-between mt-1">
            <span>{vehicle.fuelType}</span>
            <span>{vehicle.bodyType}</span>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 bg-brand-green hover:bg-brand-dark text-white py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
            View Details
          </button>
          <button className="flex-none w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
