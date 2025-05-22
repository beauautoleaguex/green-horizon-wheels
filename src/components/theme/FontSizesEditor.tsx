
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FontSizes } from '@/types/theme';

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

  // Create a sortable array of entries
  const fontSizesEntries = Object.entries(fontSizes).map(([name, size]) => {
    // Extract numeric value for sorting
    const numericValue = parseFloat(size);
    return { name, size, numericValue };
  });

  // Sort by size (largest to smallest)
  const sortedFontSizes = fontSizesEntries.sort((a, b) => b.numericValue - a.numericValue);

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      <h3 className="font-semibold mb-3 text-lg text-gray-900 dark:text-gray-100">Font Sizes</h3>
      <div className="grid gap-4">
        {sortedFontSizes.map(({ name, size }) => (
          <div key={name} className="grid grid-cols-12 gap-2 items-center">
            <Label className="col-span-2 text-gray-800 dark:text-gray-200">{name}:</Label>
            <Input
              type="text"
              value={size}
              onChange={(e) => handleInputChange(name, e.target.value)}
              className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <div className="col-span-7 overflow-hidden whitespace-nowrap text-ellipsis text-gray-900 dark:text-gray-100" style={{ 
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
