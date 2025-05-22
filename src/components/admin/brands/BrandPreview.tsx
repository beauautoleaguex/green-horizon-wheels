
import React from 'react';

interface BrandPreviewProps {
  font: string;
  color: string;
}

const BrandPreview: React.FC<BrandPreviewProps> = ({ font, color }) => {
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span style={{ fontFamily: font }} className="truncate">
        {font.split(',')[0]}
      </span>
    </div>
  );
};

export default BrandPreview;
