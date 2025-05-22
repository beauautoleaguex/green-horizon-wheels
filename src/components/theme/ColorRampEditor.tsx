
import React from 'react';
import { ColorScale } from '@/contexts/ThemeContext';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorRampEditorProps {
  colorName: string;
  scale: ColorScale;
  onColorChange: (colorName: string, step: number, value: string) => void;
}

export const ColorRampEditor: React.FC<ColorRampEditorProps> = ({
  colorName,
  scale,
  onColorChange,
}) => {
  // Create a sorted array of entries to ensure they display from 1-12
  const sortedEntries = Object.entries(scale)
    .map(([step, color]) => ({
      step: Number(step),
      color
    }))
    .sort((a, b) => a.step - b.step);

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="font-semibold mb-3 text-lg capitalize">{colorName}</h3>
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
