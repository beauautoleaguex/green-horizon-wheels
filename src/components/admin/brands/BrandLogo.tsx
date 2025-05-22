
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit } from 'lucide-react';

interface BrandLogoProps {
  logo?: string;
  brandId: string;
  brandName: string;
  onLogoChange: (brandId: string, logo: string) => void;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ logo, brandId, brandName, onLogoChange }) => {
  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        // When file is loaded, pass the data URL to the handler
        if (typeof reader.result === 'string') {
          console.log(`Logo upload for ${brandName}:`, reader.result.substring(0, 50) + '...');
          onLogoChange(brandId, reader.result);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="col-span-1 flex justify-center">
      {logo ? (
        <div className="relative group">
          <div className="h-12 w-auto" style={{ maxWidth: '100px' }}>
            <img 
              src={logo} 
              alt={`${brandName} logo`}
              className="h-12 w-auto object-contain cursor-pointer"
              onClick={() => {
                const logoInput = document.getElementById(`logo-upload-${brandId}`);
                if (logoInput) logoInput.click();
              }}
            />
            
            {/* Edit overlay that appears on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Edit className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="h-12 w-auto"
          onClick={() => {
            const logoInput = document.getElementById(`logo-upload-${brandId}`);
            if (logoInput) logoInput.click();
          }}
          title="Add logo"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add logo</span>
        </Button>
      )}
      <Input
        id={`logo-upload-${brandId}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleLogoUpload}
      />
    </div>
  );
};

export default BrandLogo;
