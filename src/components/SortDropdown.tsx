
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortDropdownProps {
  onSort: (sortType: string) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ onSort }) => {
  const handleSortChange = (value: string) => {
    onSort(value);
  };

  return (
    <div className="flex items-center">
      <label htmlFor="sort" className="mr-2 text-sm text-gray-700">Sort by:</label>
      <Select onValueChange={handleSortChange} defaultValue="default">
        <SelectTrigger className="w-[180px] py-2">
          <SelectValue placeholder="Featured" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Featured</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="year-desc">Newest First</SelectItem>
          <SelectItem value="mileage-asc">Lowest Mileage</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
