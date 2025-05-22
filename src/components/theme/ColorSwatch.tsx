
import React from 'react';
import { Palette } from "lucide-react";

interface ColorSwatchProps {
  color: string;
  onClick: () => void;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  onClick
}) => {
  return (
    <div 
      className="w-full h-10 border-t border-b border-r first:border-l cursor-pointer relative group overflow-hidden dark:border-gray-600"
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 dark:bg-white/10">
        <Palette className="w-4 h-4 text-white dark:text-gray-200" />
      </div>
    </div>
  );
};
