
import React from 'react';
import { SortDropdown } from '../SortDropdown';

interface SearchHeaderProps {
  totalVehicles: number;
  onSort: (sortType: string) => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ totalVehicles, onSort }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <div>
        <p className="text-gray-900 font-medium">{totalVehicles} vehicles for sale in Australia</p>
      </div>
      <div className="mt-3 sm:mt-0">
        <SortDropdown onSort={onSort} />
      </div>
    </div>
  );
};
