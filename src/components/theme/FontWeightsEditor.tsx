
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FontWeights } from '@/types/theme';
import { Slider } from '@/components/ui/slider';

interface FontWeightsEditorProps {
  fontWeights: FontWeights;
  onFontWeightChange: (name: string, value: number) => void;
  currentFont: string;
}

export const FontWeightsEditor: React.FC<FontWeightsEditorProps> = ({
  fontWeights,
  onFontWeightChange,
  currentFont,
}) => {
  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      <h3 className="font-semibold mb-3 text-lg text-gray-900 dark:text-gray-100">Font Weights</h3>
      <div className="grid gap-4">
        {Object.entries(fontWeights).map(([name, weight]) => (
          <div key={name} className="grid grid-cols-12 gap-4 items-center">
            <Label className="col-span-2 capitalize text-gray-800 dark:text-gray-200">{name}:</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Slider
                value={[weight]}
                min={100}
                max={900}
                step={100}
                onValueChange={(values) => onFontWeightChange(name, values[0])}
              />
              <span className="text-sm w-8 text-gray-700 dark:text-gray-300">{weight}</span>
            </div>
            <div 
              className="col-span-7 overflow-hidden whitespace-nowrap text-ellipsis text-4xl text-gray-900 dark:text-gray-100" 
              style={{ 
                fontFamily: currentFont, 
                fontWeight: weight 
              }}
            >
              Sample Text
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
