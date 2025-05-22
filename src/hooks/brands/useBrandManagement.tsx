import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Brand } from '@/types/theme';
import { UseBrandManagementProps, UseBrandManagementReturn } from './brandManagementTypes';
import { 
  saveBrandsToStorage, 
  saveCurrentBrandToStorage,
  loadBrandsFromStorage,
  loadCurrentBrandFromStorage 
} from './brandStorageUtils';
import { 
  applyMyMotoColors, 
  applyStoredBrandColors, 
  generateBrandColorRamp 
} from './brandColorUtils';
import { initialColors } from '@/constants/themeDefaults';

export const useBrandManagement = ({
  initialBrands,
  initialCurrentBrand,
  updateColors,
  updateColorRamp,
  setCurrentFont
}: UseBrandManagementProps): UseBrandManagementReturn => {
  // Initialize brands state from localStorage
  const [brands, setBrands] = useState<Brand[]>(() => 
    loadBrandsFromStorage(initialBrands)
  );
  
  // Initialize currentBrand from localStorage
  const [currentBrand, setCurrentBrand] = useState<Brand>(() =>
    loadCurrentBrandFromStorage(initialCurrentBrand)
  );
  
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
        applyMyMotoColors(updateColors);
      } else {
        // For other brands, check if we have stored colors
        if (brandColors[selectedBrand.id]) {
          applyStoredBrandColors(selectedBrand.id, brandColors, updateColors);
        } else {
          // Generate a new color ramp based on primary color
          generateBrandColorRamp(selectedBrand.primaryColor, updateColorRamp);
        }
      }
      
      // Save the current brand selection to localStorage immediately
      saveCurrentBrandToStorage(selectedBrand);
    }
  };

  // Add new brand
  const addBrand = (brandData: Omit<Brand, 'id'>) => {
    const newBrand: Brand = {
      id: uuidv4(),
      ...brandData
    };
    
    const updatedBrands = [...brands, newBrand];
    setBrands(updatedBrands);
    
    // Save brands to localStorage immediately after adding a new brand
    saveBrandsToStorage(updatedBrands);
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
    const updatedBrands = brands.filter(brand => brand.id !== brandId);
    setBrands(updatedBrands);
    
    // Remove stored colors for this brand
    const newBrandColors = { ...brandColors };
    delete newBrandColors[brandId];
    setBrandColors(newBrandColors);
    
    // Save brands to localStorage immediately after deleting a brand
    saveBrandsToStorage(updatedBrands);
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
    
    // Save brands to localStorage immediately after updating a brand color
    saveBrandsToStorage(updatedBrands);
    
    // If updating current brand, also update current brand state and color scales
    if (isCurrentBrand && brand) {
      // Update current brand state
      const updatedCurrentBrand = { ...currentBrand, primaryColor: color };
      setCurrentBrand(updatedCurrentBrand);
      
      // Save current brand to localStorage
      saveCurrentBrandToStorage(updatedCurrentBrand);
      
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
    
    // Save brands to localStorage immediately
    saveBrandsToStorage(updatedBrands);
    
    // If updating current brand, also update current brand state
    if (isCurrentBrand) {
      const updatedCurrentBrand = { ...currentBrand, logo };
      setCurrentBrand(updatedCurrentBrand);
      
      // Save current brand to localStorage
      saveCurrentBrandToStorage(updatedCurrentBrand);
    }
    
    // Log for debugging
    console.log(`Brand logo updated for ${brandId}:`, logo);
    console.log("Updated brands:", updatedBrands);
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
        applyMyMotoColors(updateColors);
      } else {
        // For other brands, regenerate the ramp from their primary color
        generateBrandColorRamp(brand.primaryColor, updateColorRamp);
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
    
    // Save brands to localStorage immediately after updating a brand font
    saveBrandsToStorage(updatedBrands);
    
    // If updating current brand, also update current font
    if (isCurrentBrand) {
      const updatedCurrentBrand = { ...currentBrand, font };
      setCurrentBrand(updatedCurrentBrand);
      setCurrentFont(font);
      
      // Save current brand to localStorage
      saveCurrentBrandToStorage(updatedCurrentBrand);
    }
  };

  // Add effect to sync changes with localStorage and log for debugging
  useEffect(() => {
    // Log current brands state for debugging
    console.log("Current brands state:", brands);
    
    // Save current state to localStorage whenever it changes
    saveBrandsToStorage(brands);
    saveCurrentBrandToStorage(currentBrand);
  }, [brands, currentBrand]);
  
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
