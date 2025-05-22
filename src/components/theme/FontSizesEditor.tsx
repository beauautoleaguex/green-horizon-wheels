
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FontSizes, TypographyScale } from '@/types/theme';
import { typographyScales } from '@/constants/themeDefaults';

interface FontSizesEditorProps {
  fontSizes: FontSizes;
  onFontSizeChange: (name: string, value: string) => void;
  currentFont: string;
  currentTypographyScale: TypographyScale;
  onTypographyScaleChange: (scale: TypographyScale) => void;
}

export const FontSizesEditor: React.FC<FontSizesEditorProps> = ({
  fontSizes,
  onFontSizeChange,
  currentFont,
  currentTypographyScale,
  onTypographyScaleChange,
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
    
    // When manually editing, switch to custom scale
    if (currentTypographyScale !== 'custom') {
      onTypographyScaleChange('custom');
    }
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
      <h3 className="font-semibold mb-3 text-lg text-gray-900 dark:text-gray-100">Typography Scale</h3>
      
      {/* Scale selector */}
      <div className="mb-6">
        <RadioGroup 
          value={currentTypographyScale} 
          onValueChange={(value) => onTypographyScaleChange(value as TypographyScale)}
          className="flex flex-col space-y-2"
        >
          {typographyScales.map((scale) => (
            <div key={scale.name} className="flex items-center space-x-2">
              <RadioGroupItem value={scale.name} id={scale.name} />
              <Label htmlFor={scale.name} className="flex flex-col">
                <span className="font-medium capitalize text-gray-900 dark:text-gray-100">{scale.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{scale.description}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Preview of text sizes */}
      <div className="mb-6 p-4 border rounded bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</h4>
        <div className="space-y-1">
          {['6xl', '5xl', '4xl', '3xl', '2xl', 'xl', 'lg', 'base', 'sm', 'xs'].map((size) => (
            <div 
              key={size} 
              className="text-gray-900 dark:text-gray-100 truncate" 
              style={{ 
                fontFamily: currentFont, 
                fontSize: fontSizes[size] || '1rem' 
              }}
            >
              {size}: The quick brown fox
            </div>
          ))}
        </div>
      </div>
      
      {/* Advanced settings (individual size adjustments) */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="advanced-settings">
          <AccordionTrigger className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Advanced Settings
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 pt-2">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
