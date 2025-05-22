
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { FEATURES } from '../filterConstants';

interface FeaturesFilterProps {
  features?: string[];
  onFilterChange: (filterKey: string, value: any) => void;
}

export const FeaturesFilter: React.FC<FeaturesFilterProps> = ({
  features = [],
  onFilterChange
}) => {
  const handleCheckboxChange = (feature: string, checked: boolean) => {
    const currentFeatures = Array.isArray(features) ? features : [];
    
    if (checked) {
      onFilterChange('features', [...currentFeatures, feature]);
    } else {
      onFilterChange('features', currentFeatures.filter(f => f !== feature));
    }
  };

  return (
    <div className="pt-2 grid grid-cols-1 gap-2">
      {FEATURES.map(feature => (
        <div key={feature} className="flex items-center space-x-2">
          <Checkbox 
            id={`feature-${feature}`} 
            checked={Array.isArray(features) && features.includes(feature)}
            onCheckedChange={(checked) => handleCheckboxChange(feature, checked === true)}
          />
          <label htmlFor={`feature-${feature}`} className="text-sm text-gray-700">
            {feature}
          </label>
        </div>
      ))}
    </div>
  );
};
