import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/theme/ThemeContext';
import { Brand } from '@/types/theme';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/admin/brands/Header';
import BrandList from '@/components/admin/brands/BrandList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import AddBrandForm from '@/components/admin/brands/AddBrandForm';

const BrandsManager: React.FC = () => {
  const { 
    brands, 
    fonts, 
    addBrand, 
    deleteBrand, 
    updateBrandColor, 
    updateBrandFont,
    updateBrandLogo,
    saveTheme,
    resetBrandColorRamp 
  } = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Log to debug if the MyMoto brand has a logo
  React.useEffect(() => {
    console.log("Brands in BrandsManager:", brands);
    const myMotoBrand = brands.find(b => b.name === 'MyMoto');
    console.log("MyMoto brand:", myMotoBrand);
  }, [brands]);

  const handleAddBrand = (newBrand: Omit<Brand, 'id'>) => {
    if (!newBrand.name.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for the brand",
        variant: "destructive",
      });
      return;
    }

    addBrand(newBrand);
    
    toast({
      title: "Brand added",
      description: `${newBrand.name} has been added to your brands`,
    });
    
    // Close the dialog after adding the brand
    setIsDialogOpen(false);
  };

  const handleDeleteBrand = (brandId: string, brandName: string) => {
    deleteBrand(brandId);
    toast({
      title: "Brand deleted",
      description: `${brandName} has been removed from your brands`,
    });
  };

  const handleResetBrand = (brandId: string, brandName: string) => {
    if (resetBrandColorRamp) {
      resetBrandColorRamp(brandId);
      toast({
        title: "Brand reset",
        description: `${brandName} has been reset to its default colors`,
      });
    }
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

  // Handle brand logo update
  const handleBrandLogoChange = (brandId: string, logo: string) => {
    if (updateBrandLogo) {
      updateBrandLogo(brandId, logo);
      toast({
        title: "Logo updated",
        description: "Brand logo has been updated successfully."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <Header onSave={handleSave} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/admin/theme" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Theme Editor
          </Link>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Brands</h2>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              size="sm"
              variant="outline"
            >
              Add a new brand
            </Button>
          </div>
          <BrandList
            brands={brands}
            fonts={fonts}
            onDeleteBrand={handleDeleteBrand}
            onBrandColorChange={handleBrandColorChange}
            onHexInputChange={handleHexInputChange}
            onBrandFontChange={handleBrandFontChange}
            onResetBrand={handleResetBrand}
            onBrandLogoChange={handleBrandLogoChange}
          />
        </div>
      </div>
      
      {/* Modal Dialog for adding a new brand */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle className="mb-4">Add New Brand</DialogTitle>
          <AddBrandForm fonts={fonts} onAddBrand={handleAddBrand} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandsManager;
