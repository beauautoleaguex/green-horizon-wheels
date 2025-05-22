
import React from 'react';
import { Brand } from '@/types/theme';
import BrandCard from './BrandCard';
import { Separator } from '@/components/ui/separator';

interface BrandListProps {
  brands: Brand[];
  fonts: string[];
  onDeleteBrand: (brandId: string, brandName: string) => void;
  onBrandColorChange: (brandId: string, color: string) => void;
  onHexInputChange: (brandId: string, hex: string) => void;
  onBrandFontChange: (brandId: string, font: string) => void;
  onResetBrand?: (brandId: string, brandName: string) => void;
}

const BrandList: React.FC<BrandListProps> = ({
  brands,
  fonts,
  onDeleteBrand,
  onBrandColorChange,
  onHexInputChange,
  onBrandFontChange,
  onResetBrand
}) => {
  if (brands.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No brands added yet.</p>;
  }

  return (
    <div className="border-border">
      {brands.map((brand, index) => (
        <React.Fragment key={brand.id}>
          <BrandCard
            brand={brand}
            fonts={fonts}
            onDelete={onDeleteBrand}
            onColorChange={onBrandColorChange}
            onHexInputChange={onHexInputChange}
            onFontChange={onBrandFontChange}
            onReset={onResetBrand}
          />
          {index < brands.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BrandList;
