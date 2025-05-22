
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BrandColorPickerProps {
  brandId: string;
  primaryColor: string;
  onColorChange: (brandId: string, color: string) => void;
  onHexInputChange: (brandId: string, hex: string) => void;
}

const BrandColorPicker: React.FC<BrandColorPickerProps> = ({ 
  brandId, 
  primaryColor, 
  onColorChange,
  onHexInputChange
}) => {
  // Handle color picker change
  const handleColorChange = (color: string) => {
    onColorChange(brandId, color);
  };

  return (
    <div className="col-span-3 flex items-center gap-3 justify-end">
      <Label htmlFor={`color-${brandId}`} className="whitespace-nowrap text-sm shrink-0">Color:</Label>
      <div className="flex items-center gap-2">
        <div 
          className="w-6 h-6 rounded-md cursor-pointer border border-gray-200 dark:border-gray-600"
          style={{ backgroundColor: primaryColor }}
          onClick={() => {
            const colorInput = document.getElementById(`color-${brandId}`);
            if (colorInput) colorInput.click();
          }}
        />
        <Input
          id={`hex-${brandId}`}
          value={primaryColor}
          onChange={(e) => onHexInputChange(brandId, e.target.value)}
          className="w-16 font-mono text-xs px-1.5 h-8"
          maxLength={7}
        />
        <Input
          id={`color-${brandId}`}
          type="color"
          value={primaryColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-0 h-0 p-0 border-0 absolute opacity-0"
        />
      </div>
    </div>
  );
};

export default BrandColorPicker;
