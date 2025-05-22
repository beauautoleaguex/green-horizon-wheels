
import React, { useState, useEffect } from 'react';
import { ColorScale } from '@/types/theme';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, CheckCircle2, RotateCcw } from "lucide-react";
import { CurveType, generateColorRamp } from '@/utils/colorUtils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ColorRampDisplay } from './ColorRampDisplay';
import { ContrastChecker } from './ContrastChecker';
import { initialColors } from '@/constants/themeDefaults';
import { toast } from '@/components/ui/use-toast';
import { useTheme } from '@/contexts/theme/ThemeContext';

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

interface ColorRampEditorProps {
  colorName: string;
  scale: ColorScale;
  onColorChange: (colorName: string, step: number, value: string) => void;
  onRampChange?: (colorName: string, baseColor: string, curveType?: CurveType) => void;
}

export const ColorRampEditor: React.FC<ColorRampEditorProps> = ({
  colorName,
  scale,
  onColorChange,
  onRampChange,
}) => {
  // Get access to theme context for brand information
  const { currentBrand, resetBrandColorRamp, storeBrandColorRamp } = useTheme();
  
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
  
  // Store the current color ramp in the brand colors when it changes
  useEffect(() => {
    if (colorName === 'brand' && currentBrand) {
      storeBrandColorRamp(currentBrand.id, scale);
    }
  }, [scale, colorName, currentBrand]);

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

  // Reset current color ramp to initial values
  const handleResetRamp = () => {
    if (colorName === 'brand' && currentBrand) {
      // For the brand color ramp, use brand-specific reset
      resetBrandColorRamp(currentBrand.id);
      
      toast({
        title: `Reset ${currentBrand.name} brand colors`,
        description: "Brand colors have been reset to default values."
      });
    } else if (initialColors[colorName]) {
      // For other color ramps, use the initial colors
      Object.entries(initialColors[colorName]).forEach(([step, color]) => {
        onColorChange(colorName, Number(step), color as string);
      });
      
      toast({
        title: `Reset ${colorName} color ramp`,
        description: "Colors have been reset to default values."
      });
    } else {
      toast({
        title: "Cannot reset colors",
        description: `No default colors found for ${colorName}.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4 border bg-white dark:bg-gray-800 dark:border-gray-700 rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg capitalize text-gray-900 dark:text-gray-100">
          {colorName === 'brand' ? `${currentBrand.name} Brand` : colorName}
        </h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetRamp}
            className="flex items-center gap-1 text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
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
      <ColorRampDisplay 
        colorName={colorName}
        sortedEntries={sortedEntries}
        onColorChange={onColorChange}
      />
      
      {/* Accessibility Contrast Checker */}
      <ContrastChecker 
        colorName={colorName}
        scale={scale}
        sortedEntries={sortedEntries}
      />
    </div>
  );
};
