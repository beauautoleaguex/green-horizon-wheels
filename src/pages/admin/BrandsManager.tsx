
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Brand } from '@/types/theme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Palette, Plus, Save, Trash } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ColorSwatch } from '@/components/theme/ColorSwatch';

const BrandsManager: React.FC = () => {
  const { brands, fonts, addBrand, deleteBrand, updateBrandColor, updateBrandFont, saveTheme } = useTheme();
  const [newBrand, setNewBrand] = useState<Omit<Brand, 'id'>>({
    name: '',
    primaryColor: '#3B82F6',
    font: fonts[0],
  });

  const handleAddBrand = () => {
    if (!newBrand.name.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for the brand",
        variant: "destructive",
      });
      return;
    }

    addBrand(newBrand);
    setNewBrand({
      name: '',
      primaryColor: '#3B82F6',
      font: fonts[0],
    });
    
    toast({
      title: "Brand added",
      description: `${newBrand.name} has been added to your brands`,
    });
  };

  const handleDeleteBrand = (brandId: string, brandName: string) => {
    deleteBrand(brandId);
    toast({
      title: "Brand deleted",
      description: `${brandName} has been removed from your brands`,
    });
  };

  const handleSave = () => {
    saveTheme();
    toast({
      title: "Brands saved",
      description: "Your brand settings have been saved successfully."
    });
  };

  // Handle brand color update
  const handleBrandColorChange = (brandId: string, color: string) => {
    updateBrandColor(brandId, color);
  };

  // Handle hex input change
  const handleHexInputChange = (brandId: string, hex: string) => {
    // Validate hex code format
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
      updateBrandColor(brandId, hex);
    } else if (hex.length <= 7) {
      // Allow typing but don't update color until valid
      // This allows users to type without validation errors interrupting
    }
  };

  // Handle brand font update
  const handleBrandFontChange = (brandId: string, font: string) => {
    updateBrandFont(brandId, font);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 border-b dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-brand-green" />
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Brand Manager</h1>
            </div>
            <div className="flex gap-2 items-center">
              <ThemeToggle />
              <Button onClick={handleSave} className="gap-1">
                <Save className="h-4 w-4" />
                Save Brands
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/admin/theme" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Theme Editor
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Add New Brand</h2>
          
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
              
              <div className="mt-3 p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <div style={{ fontFamily: newBrand.font }}>
                  <h3 className="text-xl font-bold mb-2">Brand Typography</h3>
                  <p className="mb-3">The quick brown fox jumps over the lazy dog. This text demonstrates how paragraphs will appear using this font family.</p>
                  <div className="flex gap-2">
                    <Button style={{ backgroundColor: newBrand.primaryColor }}>Primary Button</Button>
                    <Button variant="outline" style={{ borderColor: newBrand.primaryColor, color: newBrand.primaryColor }}>
                      Outline Button
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <Button onClick={handleAddBrand} className="gap-1 mt-2">
              <Plus className="h-4 w-4" />
              Add Brand
            </Button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Brands</h2>
          
          {brands.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No brands added yet.</p>
          ) : (
            <div className="space-y-4">
              {brands.map((brand) => (
                <div 
                  key={brand.id} 
                  className="p-4 border rounded-md dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-lg">{brand.name}</h3>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteBrand(brand.id, brand.name)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete {brand.name}</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Color picker for the brand */}
                    <div>
                      <Label htmlFor={`color-${brand.id}`}>Brand Color</Label>
                      <div className="flex items-center space-x-3 mt-1">
                        <div 
                          className="w-8 h-8 rounded-md cursor-pointer"
                          style={{ backgroundColor: brand.primaryColor }}
                          onClick={() => {
                            const colorInput = document.getElementById(`color-${brand.id}`);
                            if (colorInput) colorInput.click();
                          }}
                        />
                        <Input
                          id={`hex-${brand.id}`}
                          value={brand.primaryColor}
                          onChange={(e) => handleHexInputChange(brand.id, e.target.value)}
                          className="w-32 font-mono"
                          maxLength={7}
                        />
                        <Input
                          id={`color-${brand.id}`}
                          type="color"
                          value={brand.primaryColor}
                          onChange={(e) => handleBrandColorChange(brand.id, e.target.value)}
                          className="w-0 h-0 p-0 border-0 absolute opacity-0"
                        />
                      </div>
                    </div>
                    
                    {/* Font selector for the brand */}
                    <div>
                      <Label htmlFor={`font-${brand.id}`}>Brand Font</Label>
                      <Select
                        value={brand.font}
                        onValueChange={(value) => handleBrandFontChange(brand.id, value)}
                      >
                        <SelectTrigger id={`font-${brand.id}`} className="mt-1">
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
                      
                      <div className="mt-2 p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <div style={{ fontFamily: brand.font }}>
                          <h3 className="text-xl font-bold mb-2">Brand Typography</h3>
                          <p className="mb-3">The quick brown fox jumps over the lazy dog. This sample text shows how your content will appear using this font family.</p>
                          <div className="flex gap-2">
                            <Button style={{ backgroundColor: brand.primaryColor }}>Primary Button</Button>
                            <Button variant="outline" style={{ borderColor: brand.primaryColor, color: brand.primaryColor }}>
                              Outline Button
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandsManager;
