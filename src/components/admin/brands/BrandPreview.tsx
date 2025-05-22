
import React from 'react';
import { Button } from '@/components/ui/button';

interface BrandPreviewProps {
  font: string;
  color: string;
}

const BrandPreview: React.FC<BrandPreviewProps> = ({ font, color }) => {
  return (
    <div className="p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
      <div style={{ fontFamily: font }}>
        <h3 className="text-xl font-bold mb-2">Brand Typography</h3>
        <p className="mb-3">The quick brown fox jumps over the lazy dog. This sample text shows how your content will appear using this font family.</p>
        <div className="flex gap-2">
          <Button style={{ backgroundColor: color }}>Primary Button</Button>
          <Button variant="outline" style={{ borderColor: color, color: color }}>
            Outline Button
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandPreview;
