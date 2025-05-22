
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Brand } from '@/types/theme';

interface BrandSelectorProps {
  brands: Brand[];
  currentBrand: Brand;
  fonts: string[];
  onBrandChange: (brandId: string) => void;
  onColorChange: (color: string) => void;
  onFontChange: (font: string) => void;
}

export const BrandSelector: React.FC<BrandSelectorProps> = ({
  brands,
  currentBrand,
  fonts,
  onBrandChange,
  onColorChange,
  onFontChange
}) => {
  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      <h3 className="font-semibold mb-3 text-lg text-gray-900 dark:text-gray-100">Brand Selection</h3>
      
      {/* Brand dropdown */}
      <div className="mb-4">
        <Label htmlFor="brand-selector" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Brand
        </Label>
        <Select
          value={currentBrand.id}
          onValueChange={onBrandChange}
          defaultValue={currentBrand.id}
        >
          <SelectTrigger className="w-full" id="brand-selector">
            <SelectValue placeholder="Select a brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Brand color picker */}
      <div className="mb-4">
        <Label htmlFor="brand-color" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Brand Color
        </Label>
        <div className="flex gap-3 items-center">
          <div 
            className="w-10 h-10 rounded-md border dark:border-gray-600"
            style={{ backgroundColor: currentBrand.primaryColor }}
          />
          <Input
            id="brand-color"
            type="color"
            value={currentBrand.primaryColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-full h-10"
          />
        </div>
      </div>
      
      {/* Brand font selection */}
      <div className="mb-4">
        <Label htmlFor="brand-font" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Brand Font
        </Label>
        <Select
          value={currentBrand.font}
          onValueChange={onFontChange}
          defaultValue={currentBrand.font}
        >
          <SelectTrigger className="w-full" id="brand-font">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {fonts.map((font) => (
              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                {font.split(',')[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-3 p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <p className="text-lg" style={{ fontFamily: currentBrand.font }}>
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </div>
    </div>
  );
};
