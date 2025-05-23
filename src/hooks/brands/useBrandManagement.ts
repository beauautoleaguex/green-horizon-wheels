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
import { getCurrentUserId } from '@/services/themeStorageService';
import { supabase } from '@/lib/supabase';

export const useBrandManagement = ({
  initialBrands,
  initialCurrentBrand,
  updateColors,
  updateColorRamp,
  setCurrentFont,
  isAdmin = false // Added isAdmin parameter with default false
}: UseBrandManagementProps): UseBrandManagementReturn => {
  // Initialize brands state from storage
  const [brands, setBrands] = useState<Brand[]>(() => 
    loadBrandsFromStorage(initialBrands)
  );
  
  // Initialize currentBrand from localStorage
  const [currentBrand, setCurrentBrand] = useState<Brand>(() =>
    loadCurrentBrandFromStorage(initialCurrentBrand)
  );
  
  // Store the original color ramps for each brand
  const [brandColors, setBrandColors] = useState<Record<string, Record<number, string>>>({});

  // Check if user has admin role - this should be implemented based on your auth system
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(isAdmin);
  
  // Fetch admin status on mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const userId = await getCurrentUserId();
        if (userId) {
          // Here you would check if the user is an admin in your system
          // This is just an example - replace with your actual admin check
          const { data } = await supabase
            .from('admin_users')
            .select('is_admin')
            .eq('user_id', userId)
            .single();
          
          setIsUserAdmin(!!data?.is_admin);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    checkAdminStatus();
  }, []);

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
      
      // Save the current brand selection to storage
      saveCurrentBrandToStorage(selectedBrand);
    }
  };

  // Add new brand - only admins can do this
  const addBrand = (brandData: Omit<Brand, 'id'>) => {
    if (!isUserAdmin) {
      console.warn('Only admins can add brands');
      return;
    }
    
    const newBrand: Brand = {
      id: uuidv4(),
      ...brandData
    };
    
    const updatedBrands = [...brands, newBrand];
    setBrands(updatedBrands);
    
    // Save brands to storage immediately after adding a new brand
    saveBrandsToStorage(updatedBrands);
  };

  // Delete brand - only admins can do this
  const deleteBrand = (brandId: string) => {
    if (!isUserAdmin) {
      console.warn('Only admins can delete brands');
      return;
    }
    
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
    
    // Save brands to storage immediately after deleting a brand
    saveBrandsToStorage(updatedBrands);
  };

  // Update brand color - only admins can do this
  const updateBrandColor = (brandId: string, color: string) => {
    if (!isUserAdmin) {
      console.warn('Only admins can update brand colors');
      return;
    }
    
    // Check if updating current brand
    const isCurrentBrand = brandId === currentBrand.id;
    const brand = brands.find(b => b.id === brandId);
    
    // Update brands array
    const updatedBrands = brands.map(brand => 
      brand.id === brandId ? { ...brand, primaryColor: color } : brand
    );
    setBrands(updatedBrands);
    
    // Save brands to storage immediately after updating a brand color
    saveBrandsToStorage(updatedBrands);
    
    // If updating current brand, also update current brand state and color scales
    if (isCurrentBrand && brand) {
      // Update current brand state
      const updatedCurrentBrand = { ...currentBrand, primaryColor: color };
      setCurrentBrand(updatedCurrentBrand);
      
      // Save current brand to storage
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

  // Update brand logo - only admins can do this
  const updateBrandLogo = (brandId: string, logo: string) => {
    if (!isUserAdmin) {
      console.warn('Only admins can update brand logos');
      return;
    }
    
    // Check if updating current brand
    const isCurrentBrand = brandId === currentBrand.id;
    
    // Update brands array
    const updatedBrands = brands.map(brand => 
      brand.id === brandId ? { ...brand, logo } : brand
    );
    setBrands(updatedBrands);
    
    // Save brands to storage immediately
    saveBrandsToStorage(updatedBrands);
    
    // If updating current brand, also update current brand state
    if (isCurrentBrand) {
      const updatedCurrentBrand = { ...currentBrand, logo };
      setCurrentBrand(updatedCurrentBrand);
      
      // Save current brand to storage
      saveCurrentBrandToStorage(updatedCurrentBrand);
    }
    
    // Log for debugging
    console.log(`Brand logo updated for ${brandId}:`, logo);
  };

  // Store brand color ramp after generation
  const storeBrandColorRamp = (brandId: string, colorRamp: Record<number, string>) => {
    if (!isUserAdmin) {
      console.warn('Only admins can store brand color ramps');
      return;
    }
    
    setBrandColors(prev => ({
      ...prev,
      [brandId]: colorRamp
    }));
  };

  // Reset brand color ramp to the brand's original color - only admins can do this
  const resetBrandColorRamp = (brandId: string) => {
    if (!isUserAdmin) {
      console.warn('Only admins can reset brand color ramps');
      return;
    }
    
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

  // Update brand font - only admins can do this
  const updateBrandFont = (brandId: string, font: string) => {
    if (!isUserAdmin) {
      console.warn('Only admins can update brand fonts');
      return;
    }
    
    // Check if updating current brand
    const isCurrentBrand = brandId === currentBrand.id;
    
    // Update brands array
    const updatedBrands = brands.map(brand => 
      brand.id === brandId ? { ...brand, font } : brand
    );
    setBrands(updatedBrands);
    
    // Save brands to storage immediately after updating a brand font
    saveBrandsToStorage(updatedBrands);
    
    // If updating current brand, also update current font
    if (isCurrentBrand) {
      const updatedCurrentBrand = { ...currentBrand, font };
      setCurrentBrand(updatedCurrentBrand);
      setCurrentFont(font);
      
      // Save current brand to storage
      saveCurrentBrandToStorage(updatedCurrentBrand);
    }
  };

  // Add effect to sync changes with storage
  useEffect(() => {
    // Save current state to storage whenever it changes
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
    brandColors,
    isAdmin: isUserAdmin  // Expose admin status to consumers
  };
};
