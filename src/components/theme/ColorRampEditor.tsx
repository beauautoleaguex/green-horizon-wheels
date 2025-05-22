
import React from 'react';
import { ColorScale } from '@/types/theme';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import { hexToHSL, hslToHex, generateColorRamp } from '@/utils/colorUtils';

interface ColorRampEditorProps {
  colorName: string;
  scale: ColorScale;
  onColorChange: (colorName: string, step: number, value: string) => void;
  onRampChange?: (colorName: string, baseColor: string) => void;
}

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
  
  const handleBaseColorChange = (newBaseColor: string) => {
    if (onRampChange) {
      onRampChange(colorName, newBaseColor);
    } else {
      // If no onRampChange provided, generate the ramp and update each color individually
      const newRamp = generateColorRamp(newBaseColor);
      Object.entries(newRamp).forEach(([step, color]) => {
        onColorChange(colorName, Number(step), color);
      });
    }
  };

  return (
    <div className="p-4 border bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg capitalize text-gray-900 dark:text-gray-100">{colorName}</h3>
        <div className="flex items-center gap-2">
          <Label htmlFor={`${colorName}-base`} className="text-sm text-gray-700 dark:text-gray-300">Base Color:</Label>
          <div className="flex items-center gap-1">
            <div 
              className="w-6 h-6 border border-gray-200 dark:border-gray-600 cursor-pointer flex items-center justify-center"
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
      
      <div className="flex w-full">
        {sortedEntries.map(({ step, color }) => (
          <div 
            key={`${colorName}-${step}`} 
            className="flex-1 flex flex-col items-center"
          >
            <div 
              className="w-full h-10 border-t border-b border-r first:border-l cursor-pointer relative group overflow-hidden"
              style={{ backgroundColor: color }}
              onClick={() => {
                // Use the hidden input's click event
                const input = document.getElementById(`${colorName}-color-${step}`);
                if (input) {
                  input.click();
                }
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                <Palette className="w-4 h-4 text-white" />
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
    </div>
  );
};
