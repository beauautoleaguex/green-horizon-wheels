
import React from 'react';
import { Brand } from '@/types/theme';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash, RotateCcw } from 'lucide-react';
import BrandPreview from './BrandPreview';

interface BrandCardProps {
  brand: Brand;
  fonts: string[];
  onDelete: (brandId: string, brandName: string) => void;
  onColorChange: (brandId: string, color: string) => void;
  onHexInputChange: (brandId: string, hex: string) => void;
  onFontChange: (brandId: string, font: string) => void;
  onReset?: (brandId: string, brandName: string) => void;
}

const BrandCard: React.FC<BrandCardProps> = ({
  brand,
  fonts,
  onDelete,
  onColorChange,
  onHexInputChange,
  onFontChange,
  onReset
}) => {
  // Handle color picker change
  const handleColorChange = (color: string) => {
    // Use the color change handler which now uses updateColorRamp internally
    onColorChange(brand.id, color);
  };

  return (
    <div className="py-4">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Brand name - expanded column */}
        <h3 className="font-medium text-gray-900 dark:text-gray-100 text-lg col-span-4">{brand.name}</h3>
        
        {/* Color picker - aligned to right */}
        <div className="col-span-3 flex items-center gap-2 justify-end">
          <Label htmlFor={`color-${brand.id}`} className="whitespace-nowrap">Color:</Label>
          <div className="flex items-center space-x-2">
            <div 
              className="w-6 h-6 rounded-md cursor-pointer border border-gray-200 dark:border-gray-600"
              style={{ backgroundColor: brand.primaryColor }}
              onClick={() => {
                const colorInput = document.getElementById(`color-${brand.id}`);
                if (colorInput) colorInput.click();
              }}
            />
            <Input
              id={`hex-${brand.id}`}
              value={brand.primaryColor}
              onChange={(e) => onHexInputChange(brand.id, e.target.value)}
              className="w-24 font-mono text-sm"
              maxLength={7}
            />
            <Input
              id={`color-${brand.id}`}
              type="color"
              value={brand.primaryColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-0 h-0 p-0 border-0 absolute opacity-0"
            />
          </div>
        </div>
        
        {/* Font selector - aligned to right */}
        <div className="col-span-4 flex items-center gap-2 justify-end">
          <Label htmlFor={`font-${brand.id}`} className="whitespace-nowrap">Font:</Label>
          <Select
            value={brand.font}
            onValueChange={(value) => onFontChange(brand.id, value)}
          >
            <SelectTrigger id={`font-${brand.id}`} className="w-[180px]">
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
        </div>
        
        {/* Actions - neutral colors */}
        <div className="col-span-1 flex justify-end gap-2">
          {/* Reset button */}
          {onReset && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onReset(brand.id, brand.name)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/20"
              title="Reset brand"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Reset {brand.name}</span>
            </Button>
          )}
          
          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(brand.id, brand.name)}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/20"
            title="Delete brand"
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete {brand.name}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandCard;
