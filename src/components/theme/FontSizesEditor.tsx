
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FontSizes } from '@/contexts/ThemeContext';

interface FontSizesEditorProps {
  fontSizes: FontSizes;
  onFontSizeChange: (name: string, value: string) => void;
  currentFont: string;
}

export const FontSizesEditor: React.FC<FontSizesEditorProps> = ({
  fontSizes,
  onFontSizeChange,
  currentFont,
}) => {
  const handleInputChange = (name: string, value: string) => {
    // Ensure value ends with rem
    if (!value.endsWith('rem') && value !== '') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        value = `${numValue}rem`;
      } else {
        return; // Invalid input
      }
    }
    onFontSizeChange(name, value);
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="font-semibold mb-3 text-lg">Font Sizes</h3>
      <div className="grid gap-4">
        {Object.entries(fontSizes).map(([name, size]) => (
          <div key={name} className="grid grid-cols-12 gap-2 items-center">
            <Label className="col-span-2">{name}:</Label>
            <Input
              type="text"
              value={size}
              onChange={(e) => handleInputChange(name, e.target.value)}
              className="col-span-3"
            />
            <div className="col-span-7 overflow-hidden whitespace-nowrap text-ellipsis" style={{ 
              fontFamily: currentFont, 
              fontSize: size 
            }}>
              Sample Text
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
