
import React from 'react';
import { Brand } from '@/types/theme';
import BrandLogo from './BrandLogo';
import BrandColorPicker from './BrandColorPicker';
import BrandFontSelector from './BrandFontSelector';
import BrandActions from './BrandActions';

interface BrandCardProps {
  brand: Brand;
  fonts: string[];
  onDelete: (brandId: string, brandName: string) => void;
  onColorChange: (brandId: string, color: string) => void;
  onHexInputChange: (brandId: string, hex: string) => void;
  onFontChange: (brandId: string, font: string) => void;
  onReset?: (brandId: string, brandName: string) => void;
  onLogoChange?: (brandId: string, logo: string) => void;
}

const BrandCard: React.FC<BrandCardProps> = ({
  brand,
  fonts,
  onDelete,
  onColorChange,
  onHexInputChange,
  onFontChange,
  onReset,
  onLogoChange
}) => {
  // Log to debug the brand information
  React.useEffect(() => {
    console.log(`BrandCard rendering for ${brand.name}:`, brand);
    console.log(`Logo URL for ${brand.name}:`, brand.logo);
  }, [brand]);

  return (
    <div className="py-4 px-6">
      <div className="grid grid-cols-12 gap-6 items-center">
        {/* Logo component */}
        {onLogoChange && (
          <BrandLogo 
            logo={brand.logo} 
            brandId={brand.id} 
            brandName={brand.name}
            onLogoChange={onLogoChange} 
          />
        )}
        
        {/* Brand name */}
        <h3 className="font-medium text-gray-900 dark:text-gray-100 text-lg col-span-4">{brand.name}</h3>
        
        {/* Color picker component */}
        <BrandColorPicker 
          brandId={brand.id} 
          primaryColor={brand.primaryColor} 
          onColorChange={onColorChange}
          onHexInputChange={onHexInputChange}
        />
        
        {/* Font selector component */}
        <BrandFontSelector 
          brandId={brand.id} 
          fonts={fonts} 
          currentFont={brand.font}
          onFontChange={onFontChange}
        />
        
        {/* Action buttons component */}
        <BrandActions 
          brandId={brand.id} 
          brandName={brand.name} 
          onDelete={onDelete}
          onReset={onReset}
        />
      </div>
    </div>
  );
};

export default BrandCard;
