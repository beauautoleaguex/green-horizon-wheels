
import React from 'react';
import { Brand } from '@/types/theme';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash, RotateCcw, Upload, Plus } from 'lucide-react';
import BrandPreview from './BrandPreview';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  // Handle color picker change
  const handleColorChange = (color: string) => {
    // Use the color change handler which now uses updateColorRamp internally
    onColorChange(brand.id, color);
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onLogoChange) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        // When file is loaded, pass the data URL to the handler
        if (typeof reader.result === 'string') {
          onLogoChange(brand.id, reader.result);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="py-4 px-6">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Logo - new column */}
        <div className="col-span-1">
          {brand.logo ? (
            <Avatar className="h-10 w-10 cursor-pointer border border-gray-200 dark:border-gray-600" onClick={() => {
              const logoInput = document.getElementById(`logo-upload-${brand.id}`);
              if (logoInput) logoInput.click();
            }}>
              <AvatarImage src={brand.logo} alt={`${brand.name} logo`} />
              <AvatarFallback>{brand.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0"
              onClick={() => {
                const logoInput = document.getElementById(`logo-upload-${brand.id}`);
                if (logoInput) logoInput.click();
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add logo</span>
            </Button>
          )}
          <Input
            id={`logo-upload-${brand.id}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </div>
        
        {/* Brand name - adjusted column */}
        <h3 className="font-medium text-gray-900 dark:text-gray-100 text-lg col-span-3">{brand.name}</h3>
        
        {/* Color picker - adjusted to align right */}
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
        
        {/* Font selector - adjusted to align right */}
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
