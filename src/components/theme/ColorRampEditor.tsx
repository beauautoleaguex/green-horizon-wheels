
import React from 'react';
import { ColorScale } from '@/contexts/ThemeContext';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ColorRampEditorProps {
  colorName: string;
  scale: ColorScale;
  onColorChange: (colorName: string, step: number, value: string) => void;
  onRampChange?: (colorName: string, baseColor: string) => void;
}

// Helper function to convert hex to HSL
const hexToHSL = (hex: string): { h: number, s: number, l: number } => {
  // Remove the # if present
  hex = hex.replace(/^#/, '');
  
  // Convert hex to RGB
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Find the min and max values to compute the lightness
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  // Calculate HSL values
  let h = 0, s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h *= 60;
  }
  
  return { h, s, l };
};

// Helper function to convert HSL to hex
const hslToHex = (h: number, s: number, l: number): string => {
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, (h / 360) + 1/3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, (h / 360) - 1/3);
  }
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Generate a color ramp based on a base color
const generateColorRamp = (baseColor: string): ColorScale => {
  // Convert base color to HSL
  const { h, s, l } = hexToHSL(baseColor);
  
  // Generate a scale from very light to very dark
  const scale: ColorScale = {};
  for (let i = 1; i <= 12; i++) {
    // Calculate lightness for this step (from lightest to darkest)
    const stepLightness = 0.98 - (i - 1) * 0.07; // Values from ~0.98 to ~0.14
    scale[i] = hslToHex(h, s, stepLightness);
  }
  
  return scale;
};

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
    <div className="p-4 border rounded-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg capitalize">{colorName}</h3>
        <div className="flex items-center gap-2">
          <Label htmlFor={`${colorName}-base`} className="text-sm">Base Color:</Label>
          <div className="flex items-center gap-1">
            <div 
              className="w-6 h-6 rounded-md border border-gray-200"
              style={{ backgroundColor: baseColor }}
            />
            <Input
              id={`${colorName}-base`}
              type="color"
              value={baseColor}
              onChange={(e) => handleBaseColorChange(e.target.value)}
              className="w-8 h-6 p-0 overflow-hidden"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-2">
        {sortedEntries.map(({ step, color }) => (
          <div key={`${colorName}-${step}`} className="flex flex-col items-center">
            <div 
              className="w-10 h-10 rounded-md mb-1 border border-gray-200"
              style={{ backgroundColor: color }}
            />
            <div className="text-xs text-gray-600 mb-1">{step}</div>
            <Input
              type="color"
              value={color}
              onChange={(e) => onColorChange(colorName, step, e.target.value)}
              className="w-8 h-6 p-0 overflow-hidden"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
