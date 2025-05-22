
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
  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="font-semibold mb-3 text-lg capitalize">{colorName}</h3>
      <div className="grid grid-cols-6 gap-2">
        {Object.entries(scale).map(([step, color]) => {
          const stepNumber = Number(step);
          return (
            <div key={`${colorName}-${step}`} className="flex flex-col items-center">
              <div 
                className="w-12 h-12 rounded-md mb-1 border border-gray-200"
                style={{ backgroundColor: color }}
              />
              <div className="text-xs text-gray-600 mb-1">{step}</div>
              <Input
                type="color"
                value={color}
                onChange={(e) => onColorChange(colorName, stepNumber, e.target.value)}
                className="w-12 h-6 p-0 overflow-hidden"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
