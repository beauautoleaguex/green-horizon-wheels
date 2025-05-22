
import React from 'react';
import { SearchFilters } from './filters';
import { Pagination } from './Pagination';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { useVehicleSearch } from '@/hooks/useVehicleSearch';
import { MobileSearchBar } from './search/MobileSearchBar';
import { DesktopSearchBar } from './search/DesktopSearchBar';
import { FilterToggle } from './search/FilterToggle';
import { SearchHeader } from './search/SearchHeader';
import { VehicleGrid } from './search/VehicleGrid';

export const VehicleSearch = () => {
  const { 
    currentPage,
    isFilterOpen,
    setIsFilterOpen,
    filters,
    searchQuery,
    setSearchQuery,
    makes,
    models,
    bodyTypes,
    vehicles,
    totalVehicles,
    totalPages,
    isLoading,
    isInitialized,
    handlePageChange,
    handleSort,
    handleFilter,
    handleSearch
  } = useVehicleSearch();

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navigation />
      <div className="w-full mx-auto px-0 py-0 flex-grow">
        <div className="flex flex-col md:flex-row">
          {/* Search bar - visible on all screen sizes */}
          <MobileSearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />

          {/* Mobile filter toggle */}
          <FilterToggle isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} />

          {/* Filters sidebar - fixed position and width on desktop */}
          <div className={`md:sticky md:top-0 md:h-screen md:w-72 md:flex-shrink-0 md:overflow-y-auto md:bg-white md:shadow-sm md:block ${isFilterOpen ? 'block' : 'hidden'}`}>
            {/* Search bar on desktop - above filters */}
            <DesktopSearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />
            <SearchFilters 
              onFilter={handleFilter} 
              availableMakes={makes}
              availableModels={models}
              availableBodyTypes={bodyTypes}
            />
          </div>

          {/* Main content area */}
          <div className="flex-1 w-full bg-slate-50">
            <div className="flex flex-col px-4 md:px-8 py-4">
              <SearchHeader totalVehicles={totalVehicles} onSort={handleSort} />
              
              <VehicleGrid 
                vehicles={vehicles} 
                isInitialized={isInitialized} 
                isLoading={isLoading}
              />

              {vehicles.length > 0 && (
                <div className="mt-8 mb-8">
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
