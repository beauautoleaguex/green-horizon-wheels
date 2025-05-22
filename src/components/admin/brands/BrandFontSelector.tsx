
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BrandFontSelectorProps {
  brandId: string;
  fonts: string[];
  currentFont: string;
  onFontChange: (brandId: string, font: string) => void;
}

const BrandFontSelector: React.FC<BrandFontSelectorProps> = ({ 
  brandId, 
  fonts, 
  currentFont,
  onFontChange
}) => {
  return (
    <div className="col-span-3 flex items-center gap-3 justify-end">
      <Label htmlFor={`font-${brandId}`} className="whitespace-nowrap text-sm shrink-0">Font:</Label>
      <Select
        value={currentFont}
        onValueChange={(value) => onFontChange(brandId, value)}
      >
        <SelectTrigger id={`font-${brandId}`} className="max-w-[150px]">
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
  );
};

export default BrandFontSelector;
