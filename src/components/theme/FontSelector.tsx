
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FontSelectorProps {
  fonts: string[];
  currentFont: string;
  onFontChange: (font: string) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  fonts,
  currentFont,
  onFontChange,
}) => {
  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      <h3 className="font-semibold mb-3 text-lg text-gray-900 dark:text-gray-100">Font Family</h3>
      <div className="grid">
        <Select value={currentFont} onValueChange={onFontChange}>
          <SelectTrigger className="w-full">
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
        <div className="mt-4 p-4 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <p className="text-lg" style={{ fontFamily: currentFont }}>
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </div>
    </div>
  );
};
