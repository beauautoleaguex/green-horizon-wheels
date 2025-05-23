
import { Brand } from '@/types/theme';
import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from '@/services/themeStorageService';

// Save brands to Supabase and fallback to localStorage
export const saveBrandsToStorage = async (brands: Brand[]): Promise<void> => {
  // Try to save to Supabase first
  const userId = await getCurrentUserId();
  
  if (userId) {
    try {
      const { error } = await supabase
        .from('user_themes')
        .upsert({
          user_id: userId,
          brands,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
        
      if (error) {
        console.error('Error saving brands to Supabase:', error);
        // Fallback to localStorage
        localStorage.setItem('themeStorageBrands', JSON.stringify(brands));
      }
    } catch (err) {
      console.error('Failed to save brands to Supabase:', err);
      // Fallback to localStorage
      localStorage.setItem('themeStorageBrands', JSON.stringify(brands));
    }
  } else {
    // No user ID, use localStorage
    localStorage.setItem('themeStorageBrands', JSON.stringify(brands));
  }
};

// Save current brand to Supabase and fallback to localStorage
export const saveCurrentBrandToStorage = async (brand: Brand): Promise<void> => {
  // Try to save to Supabase first
  const userId = await getCurrentUserId();
  
  if (userId) {
    try {
      const { error } = await supabase
        .from('user_themes')
        .upsert({
          user_id: userId,
          current_brand: brand,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
        
      if (error) {
        console.error('Error saving current brand to Supabase:', error);
        // Fallback to localStorage
        localStorage.setItem('themeStorageCurrentBrand', JSON.stringify(brand));
      }
    } catch (err) {
      console.error('Failed to save current brand to Supabase:', err);
      // Fallback to localStorage
      localStorage.setItem('themeStorageCurrentBrand', JSON.stringify(brand));
    }
  } else {
    // No user ID, use localStorage
    localStorage.setItem('themeStorageCurrentBrand', JSON.stringify(brand));
  }
};

// Load brands from storage with logo handling
export const loadBrandsFromStorage = (initialBrands: Brand[]): Brand[] => {
  const savedBrands = localStorage.getItem('themeStorageBrands');
  
  // If we have saved brands, use them
  if (savedBrands) {
    const parsedBrands = JSON.parse(savedBrands) as Brand[];
    
    // Ensure MyMoto has its logo if one isn't already saved
    return parsedBrands.map(brand => {
      if (brand.name === 'MyMoto' && !brand.logo) {
        return {
          ...brand,
          logo: '/lovable-uploads/d99fbaef-645b-46ba-975c-5b747c2667b9.png'
        };
      }
      return brand;
    });
  }
  
  // If no saved brands, use initialBrands with MyMoto logo
  return initialBrands.map(brand => {
    if (brand.name === 'MyMoto' && !brand.logo) {
      return {
        ...brand,
        logo: '/lovable-uploads/d99fbaef-645b-46ba-975c-5b747c2667b9.png'
      };
    }
    return brand;
  });
};

// Load current brand from storage with logo handling
export const loadCurrentBrandFromStorage = (initialCurrentBrand: Brand): Brand => {
  const savedCurrentBrand = localStorage.getItem('themeStorageCurrentBrand');
  
  if (savedCurrentBrand) {
    const parsedBrand = JSON.parse(savedCurrentBrand) as Brand;
    // Make sure the MyMoto brand has its logo
    if (parsedBrand.name === 'MyMoto' && !parsedBrand.logo) {
      return {
        ...parsedBrand,
        logo: '/lovable-uploads/d99fbaef-645b-46ba-975c-5b747c2667b9.png'
      };
    }
    return parsedBrand;
  }
  
  // Default to initialCurrentBrand with logo if it's MyMoto
  if (initialCurrentBrand.name === 'MyMoto' && !initialCurrentBrand.logo) {
    return {
      ...initialCurrentBrand,
      logo: '/lovable-uploads/d99fbaef-645b-46ba-975c-5b747c2667b9.png'
    };
  }
  
  return initialCurrentBrand;
};
