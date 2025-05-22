
import React from 'react';
import { Brand } from '@/types/theme';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash } from 'lucide-react';
import BrandPreview from './BrandPreview';

interface BrandCardProps {
  brand: Brand;
  fonts: string[];
  onDelete: (brandId: string, brandName: string) => void;
  onColorChange: (brandId: string, color: string) => void;
  onHexInputChange: (brandId: string, hex: string) => void;
  onFontChange: (brandId: string, font: string) => void;
}

const BrandCard: React.FC<BrandCardProps> = ({
  brand,
  fonts,
  onDelete,
  onColorChange,
  onHexInputChange,
  onFontChange
}) => {
  // Handle color picker change
  const handleColorChange = (color: string) => {
    // Use the color change handler which now uses updateColorRamp internally
    onColorChange(brand.id, color);
  };

  return (
    <div className="p-4 border rounded-md dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 text-lg">{brand.name}</h3>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(brand.id, brand.name)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete {brand.name}</span>
        </Button>
      </div>
      
      <div className="space-y-3">
        {/* Color picker for the brand */}
        <div>
          <Label htmlFor={`color-${brand.id}`}>Brand Color</Label>
          <div className="flex items-center space-x-3 mt-1">
            <div 
              className="w-8 h-8 rounded-md cursor-pointer"
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
              className="w-32 font-mono"
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
        
        {/* Font selector for the brand */}
        <div>
          <Label htmlFor={`font-${brand.id}`}>Brand Font</Label>
          <Select
            value={brand.font}
            onValueChange={(value) => onFontChange(brand.id, value)}
          >
            <SelectTrigger id={`font-${brand.id}`} className="mt-1">
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
          
          <div className="mt-2">
            <BrandPreview font={brand.font} color={brand.primaryColor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCard;
