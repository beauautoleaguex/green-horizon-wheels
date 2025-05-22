
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Brand } from '@/types/theme';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/admin/brands/Header';
import AddBrandForm from '@/components/admin/brands/AddBrandForm';
import BrandList from '@/components/admin/brands/BrandList';

const BrandsManager: React.FC = () => {
  const { brands, fonts, addBrand, deleteBrand, updateBrandColor, updateBrandFont, saveTheme } = useTheme();

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
      <Header onSave={handleSave} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/admin/theme" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Theme Editor
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Add New Brand</h2>
          <AddBrandForm fonts={fonts} onAddBrand={handleAddBrand} />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Brands</h2>
          <BrandList
            brands={brands}
            fonts={fonts}
            onDeleteBrand={handleDeleteBrand}
            onBrandColorChange={handleBrandColorChange}
            onHexInputChange={handleHexInputChange}
            onBrandFontChange={handleBrandFontChange}
          />
        </div>
      </div>
    </div>
  );
};

export default BrandsManager;
