
import React, { useState } from 'react';

interface SortDropdownProps {
  onSort: (sortType: string) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ onSort }) => {
  const [sortType, setSortType] = useState('default');

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortType(value);
    onSort(value);
  };

  return (
    <div className="flex items-center">
      <label htmlFor="sort" className="mr-2 text-sm text-gray-700">Sort by:</label>
      <select
        id="sort"
        value={sortType}
        onChange={handleSortChange}
        className="rounded-md border border-gray-300 py-2 px-3 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
      >
        <option value="default">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="year-desc">Newest First</option>
        <option value="mileage-asc">Lowest Mileage</option>
      </select>
    </div>
  );
};
