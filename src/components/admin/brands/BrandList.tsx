
import React from 'react';
import { Brand } from '@/types/theme';
import BrandCard from './BrandCard';

interface BrandListProps {
  brands: Brand[];
  fonts: string[];
  onDeleteBrand: (brandId: string, brandName: string) => void;
  onBrandColorChange: (brandId: string, color: string) => void;
  onHexInputChange: (brandId: string, hex: string) => void;
  onBrandFontChange: (brandId: string, font: string) => void;
}

const BrandList: React.FC<BrandListProps> = ({
  brands,
  fonts,
  onDeleteBrand,
  onBrandColorChange,
  onHexInputChange,
  onBrandFontChange
}) => {
  if (brands.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No brands added yet.</p>;
  }

  return (
    <div className="space-y-3">
      {brands.map((brand) => (
        <BrandCard
          key={brand.id}
          brand={brand}
          fonts={fonts}
          onDelete={onDeleteBrand}
          onColorChange={onBrandColorChange}
          onHexInputChange={onHexInputChange}
          onFontChange={onBrandFontChange}
        />
      ))}
    </div>
  );
};

export default BrandList;
