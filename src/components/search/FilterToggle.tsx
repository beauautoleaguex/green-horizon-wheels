
import React from 'react';

interface FilterToggleProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
}

export const FilterToggle: React.FC<FilterToggleProps> = ({ isFilterOpen, setIsFilterOpen }) => {
  return (
    <button 
      className="md:hidden flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-4 mx-4 mt-0"
      onClick={() => setIsFilterOpen(!isFilterOpen)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm1 5a1 1 0 100 2h16a1 1 0 100-2H4z" />
      </svg>
      {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
    </button>
  );
};
