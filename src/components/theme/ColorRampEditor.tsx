
import React, { useState } from 'react';
import { ColorScale } from '@/types/theme';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, CheckCircle2 } from "lucide-react";
import { 
  hexToHSL, 
  hslToHex, 
  generateColorRamp, 
  CurveType, 
  calculateContrastRatio,
  meetsAccessibilityStandard
} from '@/utils/colorUtils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

interface ColorRampEditorProps {
  colorName: string;
  scale: ColorScale;
  onColorChange: (colorName: string, step: number, value: string) => void;
  onRampChange?: (colorName: string, baseColor: string, curveType?: CurveType) => void;
}

// Available curve types with descriptive labels
const curveOptions: Array<{value: CurveType, label: string, description: string}> = [
  { value: 'linear', label: 'Linear', description: 'Even distribution from light to dark' },
  { value: 'exponential', label: 'Exponential', description: 'More light shades, fewer dark' },
  { value: 'logarithmic', label: 'Logarithmic', description: 'More dark shades, fewer light' },
  { value: 'emphasizeMiddle', label: 'Midtone Focus', description: 'More detail in middle shades' },
  { value: 'emphasizeEnds', label: 'End Focus', description: 'More detail in light and dark ends' },
  { value: 'accessibility-AA', label: 'AA Accessible', description: 'Optimized for WCAG 2.0 AA standard (4.5:1)' },
  { value: 'accessibility-AAA', label: 'AAA Accessible', description: 'Optimized for WCAG 2.0 AAA standard (7:1)' },
];

export const ColorRampEditor: React.FC<ColorRampEditorProps> = ({
  colorName,
  scale,
  onColorChange,
  onRampChange,
}) => {
  // Create a sorted array of entries to ensure they display from 1-12
  const sortedEntries = Object.entries(scale)
    .map(([step, color]) => ({
      step: Number(step),
      color
    }))
    .sort((a, b) => a.step - b.step);
    
  // Find the middle color (index 6, which is step 7) to use as base color
  const baseColor = scale[7] || scale[6] || Object.values(scale)[Math.floor(Object.values(scale).length / 2)];
  
  // State for the selected curve type
  const [selectedCurve, setSelectedCurve] = useState<CurveType>('linear');
  
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

  const handleBaseColorChange = (newBaseColor: string) => {
    if (onRampChange) {
      onRampChange(colorName, newBaseColor, selectedCurve);
    } else {
      // If no onRampChange provided, generate the ramp and update each color individually
      const newRamp = generateColorRamp(newBaseColor, selectedCurve);
      Object.entries(newRamp).forEach(([step, color]) => {
        onColorChange(colorName, Number(step), color);
      });
    }
  };
  
  const handleCurveChange = (newCurve: CurveType) => {
    setSelectedCurve(newCurve);
    if (onRampChange) {
      onRampChange(colorName, baseColor, newCurve);
    } else {
      // If no onRampChange provided, generate the ramp and update each color individually
      const newRamp = generateColorRamp(baseColor, newCurve);
      Object.entries(newRamp).forEach(([step, color]) => {
        onColorChange(colorName, Number(step), color);
      });
    }
  };

  return (
    <div className="p-4 border bg-white dark:bg-gray-800 dark:border-gray-700 rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg capitalize text-gray-900 dark:text-gray-100">{colorName}</h3>
        <div className="flex items-center gap-2">
          <Label htmlFor={`${colorName}-base`} className="text-sm text-gray-700 dark:text-gray-300">Base Color:</Label>
          <div className="flex items-center gap-1">
            <div 
              className="w-6 h-6 border border-gray-200 dark:border-gray-600 cursor-pointer flex items-center justify-center rounded-md"
              style={{ backgroundColor: baseColor }}
              onClick={() => {
                // Use the hidden input's click event
                const input = document.getElementById(`${colorName}-base`);
                if (input) {
                  input.click();
                }
              }}
            >
              <Palette className="w-3 h-3 text-white opacity-50 hover:opacity-100" />
            </div>
            <Input
              id={`${colorName}-base`}
              type="color"
              value={baseColor}
              onChange={(e) => handleBaseColorChange(e.target.value)}
              className="w-0 h-0 p-0 overflow-hidden absolute opacity-0"
              aria-label={`Choose base color for ${colorName}`}
            />
          </div>
        </div>
      </div>
      
      {/* Distribution Curve Selector */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-gray-700 dark:text-gray-300">Distribution Curve:</Label>
          <Select value={selectedCurve} onValueChange={(value) => handleCurveChange(value as CurveType)}>
            <SelectTrigger className="w-[180px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
              <SelectValue placeholder="Select curve" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              {curveOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="flex items-center justify-between dark:text-gray-200 dark:focus:bg-gray-600 dark:hover:bg-gray-600">
                  <span>{option.label}</span>
                  {(option.value === 'accessibility-AA' || option.value === 'accessibility-AAA') && (
                    <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {curveOptions.find(o => o.value === selectedCurve)?.description}
        </p>
      </div>
      
      {/* Color Ramp Display */}
      <div className="flex w-full rounded-md overflow-hidden">
        {sortedEntries.map(({ step, color }) => (
          <div 
            key={`${colorName}-${step}`} 
            className="flex-1 flex flex-col items-center"
          >
            <div 
              className="w-full h-10 border-t border-b border-r first:border-l cursor-pointer relative group overflow-hidden dark:border-gray-600"
              style={{ backgroundColor: color }}
              onClick={() => {
                // Use the hidden input's click event
                const input = document.getElementById(`${colorName}-color-${step}`);
                if (input) {
                  input.click();
                }
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 dark:bg-white/10">
                <Palette className="w-4 h-4 text-white dark:text-gray-200" />
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{step}</div>
            <Input
              id={`${colorName}-color-${step}`}
              type="color"
              value={color}
              onChange={(e) => onColorChange(colorName, step, e.target.value)}
              className="w-0 h-0 p-0 overflow-hidden absolute opacity-0"
              aria-label={`Choose color for ${colorName} step ${step}`}
            />
          </div>
        ))}
      </div>
      
      {/* Accessibility Contrast Checker */}
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
    </div>
  );
};
