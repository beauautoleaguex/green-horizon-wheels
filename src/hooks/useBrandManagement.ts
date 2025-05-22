import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Brand } from '@/types/theme';
import { CurveType } from '@/utils/colorUtils';
import { initialColors } from '@/constants/themeDefaults';

interface UseBrandManagementProps {
  initialBrands: Brand[];
  initialCurrentBrand: Brand;
  updateColors: (colorName: string, step: number, value: string) => void;
  updateColorRamp: (colorName: string, baseColor: string, curveType?: CurveType) => void;
  setCurrentFont: (font: string) => void;
}

export const useBrandManagement = ({
  initialBrands,
  initialCurrentBrand,
  updateColors,
  updateColorRamp,
  setCurrentFont
}: UseBrandManagementProps) => {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [currentBrand, setCurrentBrand] = useState<Brand>(initialCurrentBrand);

  // Switch brand
  const switchBrand = (brandId: string) => {
    const selectedBrand = brands.find(brand => brand.id === brandId);
    if (selectedBrand) {
      setCurrentBrand(selectedBrand);
      
      // Update font
      setCurrentFont(selectedBrand.font);
      
      // Special handling for "MyMoto" brand - use the original predefined color ramp
      if (selectedBrand.name === 'MyMoto') {
        // Apply each color from the default brand color scale
        Object.entries(initialColors.brand).forEach(([step, color]) => {
          updateColors('brand', Number(step), color);
        });
      } else {
        // For other brands, generate a new color ramp based on primary color
        updateColorRamp('brand', selectedBrand.primaryColor);
      }
    }
  };

  // Add new brand
  const addBrand = (brandData: Omit<Brand, 'id'>) => {
    const newBrand: Brand = {
      id: uuidv4(),
      ...brandData
    };
    
    setBrands(prev => [...prev, newBrand]);
  };

  // Delete brand
  const deleteBrand = (brandId: string) => {
    // Prevent deleting the last brand
    if (brands.length <= 1) {
      console.warn("Cannot delete the last brand");
      return;
    }
    
    // If deleting the current brand, switch to another brand first
    if (currentBrand.id === brandId) {
      const otherBrand = brands.find(b => b.id !== brandId);
      if (otherBrand) {
        switchBrand(otherBrand.id);
      }
    }
    
    // Remove the brand
    setBrands(prev => prev.filter(brand => brand.id !== brandId));
  };

  // Update brand color
  const updateBrandColor = (brandId: string, color: string) => {
    // Check if updating current brand
    const isCurrentBrand = brandId === currentBrand.id;
    const brand = brands.find(b => b.id === brandId);
    
    // Update brands array
    const updatedBrands = brands.map(brand => 
      brand.id === brandId ? { ...brand, primaryColor: color } : brand
    );
    setBrands(updatedBrands);
    
    // If updating current brand, also update current brand state and color scales
    if (isCurrentBrand && brand) {
      // Update current brand state
      setCurrentBrand(prev => ({ ...prev, primaryColor: color }));
      
      // Special handling for "MyMoto" brand
      if (brand.name === 'MyMoto') {
        // For MyMoto, only update the primary color (step 9) but keep other colors from default ramp
        updateColors('brand', 9, color);
      } else {
        // For other brands, regenerate the entire color ramp
        updateColorRamp('brand', color);
      }
    }
  };

  // Update brand font
  const updateBrandFont = (brandId: string, font: string) => {
    // Check if updating current brand
    const isCurrentBrand = brandId === currentBrand.id;
    
    // Update brands array
    const updatedBrands = brands.map(brand => 
      brand.id === brandId ? { ...brand, font } : brand
    );
    setBrands(updatedBrands);
    
    // If updating current brand, also update current font
    if (isCurrentBrand) {
      setCurrentBrand(prev => ({ ...prev, font }));
      setCurrentFont(font);
    }
  };

  return {
    brands,
    setBrands,
    currentBrand,
    setCurrentBrand,
    switchBrand,
    addBrand,
    deleteBrand,
    updateBrandColor,
    updateBrandFont
  };
};
