
import { Brand } from '@/types/theme';

// Save brands to localStorage
export const saveBrandsToStorage = (brands: Brand[]): void => {
  localStorage.setItem('themeStorageBrands', JSON.stringify(brands));
};

// Save current brand to localStorage
export const saveCurrentBrandToStorage = (brand: Brand): void => {
  localStorage.setItem('themeStorageCurrentBrand', JSON.stringify(brand));
};

// Load brands from localStorage with logo handling
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

// Load current brand from localStorage with logo handling
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
