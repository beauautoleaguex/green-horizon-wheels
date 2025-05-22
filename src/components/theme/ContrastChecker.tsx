
import React, { useState } from 'react';
import { ColorScale } from '@/types/theme';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";
import { 
  calculateContrastRatio,
  meetsAccessibilityStandard 
} from '@/utils/colorUtils';

interface ColorEntry {
  step: number;
  color: string;
}

interface ContrastCheckerProps {
  colorName: string;
  scale: ColorScale;
  sortedEntries: ColorEntry[];
}

export const ContrastChecker: React.FC<ContrastCheckerProps> = ({ 
  colorName, 
  scale, 
  sortedEntries 
}) => {
  // State for the selected color pair to test contrast
  const [contrastTestColors, setContrastTestColors] = useState({
    foreground: scale[9] || '#000000', // Default to a dark color for text
    background: scale[1] || '#ffffff'  // Default to a light color for background
  });
  
  // Calculate the contrast ratio for the selected colors
  const contrastRatio = calculateContrastRatio(
    contrastTestColors.foreground,
    contrastTestColors.background
  );
  
  // Check if the contrast meets accessibility standards
  const meetsAA = meetsAccessibilityStandard(
    contrastTestColors.foreground,
    contrastTestColors.background,
    'AA'
  );
  
  const meetsAAA = meetsAccessibilityStandard(
    contrastTestColors.foreground,
    contrastTestColors.background,
    'AAA'
  );

  return (
    <div className="mt-6 border-t pt-4 dark:border-gray-700">
      <h4 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Accessibility Contrast Checker</h4>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label className="text-xs text-gray-600 dark:text-gray-400">Text Color:</Label>
          <div className="flex items-center gap-2 mt-1">
            <div 
              className="w-6 h-6 border border-gray-200 dark:border-gray-600 cursor-pointer rounded-md"
              style={{ backgroundColor: contrastTestColors.foreground }}
              onClick={() => {
                const input = document.getElementById(`${colorName}-contrast-fg`);
                if (input) input.click();
              }}
            />
            <ToggleGroup 
              type="single" 
              value={sortedEntries.find(e => e.color === contrastTestColors.foreground)?.step.toString()}
              onValueChange={(value) => {
                if (value) {
                  const step = parseInt(value);
                  setContrastTestColors(prev => ({...prev, foreground: scale[step]}));
                }
              }}
              className="dark:bg-gray-700 rounded-md overflow-hidden"
            >
              {sortedEntries.map(({ step, color }) => (
                <ToggleGroupItem 
                  key={`fg-${step}`} 
                  value={step.toString()} 
                  className="w-6 h-6 p-0 m-0 dark:data-[state=on]:bg-gray-600 dark:hover:bg-gray-600 dark:text-gray-300"
                  aria-label={`Use step ${step} as foreground`}
                >
                  <span className="text-xs">{step}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Input
              id={`${colorName}-contrast-fg`}
              type="color"
              value={contrastTestColors.foreground}
              onChange={(e) => setContrastTestColors(prev => ({...prev, foreground: e.target.value}))}
              className="w-0 h-0 p-0 overflow-hidden absolute opacity-0"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <Label className="text-xs text-gray-600 dark:text-gray-400">Background Color:</Label>
          <div className="flex items-center gap-2 mt-1">
            <div 
              className="w-6 h-6 border border-gray-200 dark:border-gray-600 cursor-pointer rounded-md"
              style={{ backgroundColor: contrastTestColors.background }}
              onClick={() => {
                const input = document.getElementById(`${colorName}-contrast-bg`);
                if (input) input.click();
              }}
            />
            <ToggleGroup 
              type="single" 
              value={sortedEntries.find(e => e.color === contrastTestColors.background)?.step.toString()}
              onValueChange={(value) => {
                if (value) {
                  const step = parseInt(value);
                  setContrastTestColors(prev => ({...prev, background: scale[step]}));
                }
              }}
              className="dark:bg-gray-700 rounded-md overflow-hidden"
            >
              {sortedEntries.map(({ step, color }) => (
                <ToggleGroupItem 
                  key={`bg-${step}`} 
                  value={step.toString()} 
                  className="w-6 h-6 p-0 m-0 dark:data-[state=on]:bg-gray-600 dark:hover:bg-gray-600 dark:text-gray-300"
                  aria-label={`Use step ${step} as background`}
                >
                  <span className="text-xs">{step}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Input
              id={`${colorName}-contrast-bg`}
              type="color"
              value={contrastTestColors.background}
              onChange={(e) => setContrastTestColors(prev => ({...prev, background: e.target.value}))}
              className="w-0 h-0 p-0 overflow-hidden absolute opacity-0"
            />
          </div>
        </div>
      </div>
      
      {/* Preview and contrast ratio */}
      <div className="mt-4 flex items-stretch rounded-md overflow-hidden shadow-sm">
        <div 
          className="flex-1 p-3 flex items-center justify-center border rounded-l dark:border-gray-700"
          style={{ backgroundColor: contrastTestColors.background, color: contrastTestColors.foreground }}
        >
          <span className="text-sm font-medium">Sample Text</span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-r flex items-center border-t border-r border-b dark:border-gray-600">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium dark:text-gray-300">Contrast:</span>
              <span className={`text-sm ${contrastRatio >= 7 ? 'text-green-600 dark:text-green-400 font-bold' : contrastRatio >= 4.5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                {contrastRatio.toFixed(2)}:1
              </span>
            </div>
            <div className="text-xs mt-1">
              {meetsAA ? (
                <span className="text-green-600 dark:text-green-400">✓ AA</span>
              ) : (
                <span className="text-red-600 dark:text-red-400">✗ AA</span>
              )}
              {' | '}
              {meetsAAA ? (
                <span className="text-green-600 dark:text-green-400">✓ AAA</span>
              ) : (
                <span className="text-red-600 dark:text-red-400">✗ AAA</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
