
import React, { useState } from 'react';
import { Brand } from '@/types/theme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';
import BrandPreview from './BrandPreview';
import { DialogClose } from '@/components/ui/dialog';

interface AddBrandFormProps {
  fonts: string[];
  onAddBrand: (brand: Omit<Brand, 'id'>) => void;
}

const AddBrandForm: React.FC<AddBrandFormProps> = ({ fonts, onAddBrand }) => {
  const [newBrand, setNewBrand] = useState<Omit<Brand, 'id'>>({
    name: '',
    primaryColor: '#3B82F6',
    font: fonts[0],
  });

  const handleSubmit = () => {
    if (newBrand.name.trim()) {
      onAddBrand(newBrand);
      // Reset form
      setNewBrand({
        name: '',
        primaryColor: '#3B82F6',
        font: fonts[0],
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="brand-name">Brand Name</Label>
        <Input
          id="brand-name"
          placeholder="Enter brand name"
          value={newBrand.name}
          onChange={(e) => setNewBrand(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="brand-color">Brand Color</Label>
        <div className="flex gap-3 items-center mt-1">
          <div className="flex items-center space-x-3 w-full">
            <div 
              className="w-10 h-10 rounded-md border cursor-pointer dark:border-gray-600"
              style={{ backgroundColor: newBrand.primaryColor }}
              onClick={() => {
                const colorInput = document.getElementById('brand-color');
                if (colorInput) colorInput.click();
              }}
            />
            <Input
              value={newBrand.primaryColor}
              onChange={(e) => setNewBrand(prev => ({ ...prev, primaryColor: e.target.value }))}
              className="w-32 font-mono"
              maxLength={7}
            />
            <Input
              id="brand-color"
              type="color"
              value={newBrand.primaryColor}
              onChange={(e) => setNewBrand(prev => ({ ...prev, primaryColor: e.target.value }))}
              className="w-0 h-0 p-0 border-0 absolute opacity-0"
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="brand-font">Brand Font</Label>
        <Select
          value={newBrand.font}
          onValueChange={(value) => setNewBrand(prev => ({ ...prev, font: value }))}
        >
          <SelectTrigger id="brand-font" className="mt-1">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {fonts.map((font) => (
              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                {font.split(',')[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="mt-3">
          <Label className="text-sm text-gray-500 dark:text-gray-400">Preview:</Label>
          <div className="mt-1 border p-2 rounded-md dark:border-gray-700">
            <BrandPreview font={newBrand.font} color={newBrand.primaryColor} />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={handleSubmit}>
          <Plus className="h-4 w-4 mr-1" />
          Add Brand
        </Button>
      </div>
    </div>
  );
};

export default AddBrandForm;
