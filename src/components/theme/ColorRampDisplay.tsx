
import React from 'react';
import { Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ColorSwatch } from './ColorSwatch';

interface ColorEntry {
  step: number;
  color: string;
}

interface ColorRampDisplayProps {
  colorName: string;
  sortedEntries: ColorEntry[];
  onColorChange: (colorName: string, step: number, value: string) => void;
}

export const ColorRampDisplay: React.FC<ColorRampDisplayProps> = ({
  colorName,
  sortedEntries,
  onColorChange
}) => {
  return (
    <div className="flex w-full rounded-md overflow-hidden">
      {sortedEntries.map(({ step, color }) => (
        <div 
          key={`${colorName}-${step}`} 
          className="flex-1 flex flex-col items-center"
        >
          <ColorSwatch 
            color={color}
            onClick={() => {
              // Use the hidden input's click event
              const input = document.getElementById(`${colorName}-color-${step}`);
              if (input) {
                input.click();
              }
            }}
          />
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
  );
};
