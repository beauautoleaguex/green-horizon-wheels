
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
  // Check if the MyMoto brand has a logo. If not, add it
  const brandsWithMyMotoLogo = initialBrands.map(brand => {
    if (brand.name === 'MyMoto' && !brand.logo) {
      return {
        ...brand,
        logo: '/lovable-uploads/d99fbaef-645b-46ba-975c-5b747c2667b9.png'
      };
    }
    return brand;
  });

  const [brands, setBrands] = useState<Brand[]>(brandsWithMyMotoLogo);
  
  // Make sure the current brand also has the logo if it's MyMoto
  const currentBrandWithLogo = initialCurrentBrand.name === 'MyMoto' && !initialCurrentBrand.logo
    ? { ...initialCurrentBrand, logo: '/lovable-uploads/d99fbaef-645b-46ba-975c-5b747c2667b9.png' }
    : initialCurrentBrand;
  
  const [currentBrand, setCurrentBrand] = useState<Brand>(currentBrandWithLogo);
  
  // Store the original color ramps for each brand
  const [brandColors, setBrandColors] = useState<Record<string, Record<number, string>>>({});

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
        // For other brands, check if we have stored colors for this brand
        if (brandColors[selectedBrand.id]) {
          // Use the stored colors for this brand
          Object.entries(brandColors[selectedBrand.id]).forEach(([step, color]) => {
            updateColors('brand', Number(step), color);
          });
        } else {
          // Generate a new color ramp based on primary color
          updateColorRamp('brand', selectedBrand.primaryColor);
          
          // Store the generated colors for this brand
          const newBrandColors = { ...brandColors };
          // We'll populate this in updateBrandColor when the ramp is generated
        }
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
    
    // Remove stored colors for this brand
    const newBrandColors = { ...brandColors };
    delete newBrandColors[brandId];
    setBrandColors(newBrandColors);
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
        
        // Store the updated MyMoto colors
        const myMotoColors = { ...initialColors.brand, 9: color };
        setBrandColors(prev => ({ ...prev, [brandId]: myMotoColors }));
      } else {
        // For other brands, regenerate the entire color ramp
        updateColorRamp('brand', color);
        
        // Store the new color ramp for this brand (we'll capture it in the ColorRampEditor)
      }
    }
  };

  // Update brand logo
  const updateBrandLogo = (brandId: string, logo: string) => {
    // Check if updating current brand
    const isCurrentBrand = brandId === currentBrand.id;
    
    // Update brands array
    const updatedBrands = brands.map(brand => 
      brand.id === brandId ? { ...brand, logo } : brand
    );
    setBrands(updatedBrands);
    
    // If updating current brand, also update current brand state
    if (isCurrentBrand) {
      setCurrentBrand(prev => ({ ...prev, logo }));
    }
  };

  // Store brand color ramp after generation
  const storeBrandColorRamp = (brandId: string, colorRamp: Record<number, string>) => {
    setBrandColors(prev => ({
      ...prev,
      [brandId]: colorRamp
    }));
  };

  // Reset brand color ramp to the brand's original color
  const resetBrandColorRamp = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    if (!brand) return;
    
    // If it's the current brand, update the UI
    if (brandId === currentBrand.id) {
      if (brand.name === 'MyMoto') {
        // Reset to MyMoto's initial colors
        Object.entries(initialColors.brand).forEach(([step, color]) => {
          updateColors('brand', Number(step), color);
        });
      } else {
        // For other brands, regenerate the ramp from their primary color
        updateColorRamp('brand', brand.primaryColor);
      }
    }
    
    // Remove any stored custom colors for this brand to reset to default
    const newBrandColors = { ...brandColors };
    delete newBrandColors[brandId];
    setBrandColors(newBrandColors);
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
    updateBrandFont,
    updateBrandLogo,
    storeBrandColorRamp,
    resetBrandColorRamp,
    brandColors
  };
};
