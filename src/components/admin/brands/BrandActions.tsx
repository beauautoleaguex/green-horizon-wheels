
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash, RotateCcw } from 'lucide-react';

interface BrandActionsProps {
  brandId: string;
  brandName: string;
  onDelete: (brandId: string, brandName: string) => void;
  onReset?: (brandId: string, brandName: string) => void;
}

const BrandActions: React.FC<BrandActionsProps> = ({ 
  brandId, 
  brandName, 
  onDelete,
  onReset 
}) => {
  return (
    <div className="col-span-1 flex justify-end gap-2">
      {/* Reset button */}
      {onReset && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onReset(brandId, brandName)}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/20 h-8 w-8"
          title="Reset brand"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only">Reset {brandName}</span>
        </Button>
      )}
      
      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(brandId, brandName)}
        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/20 h-8 w-8"
        title="Delete brand"
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only">Delete {brandName}</span>
      </Button>
    </div>
  );
};

export default BrandActions;
