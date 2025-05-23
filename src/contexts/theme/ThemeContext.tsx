
import React, { createContext, useContext } from 'react';
import { ThemeContextValue, ThemeProviderProps } from './types';
import { ThemeMode, TypographyScale } from '@/types/theme';
import { useThemeStorage } from '@/hooks/useThemeStorage';
import { useBrandManagement } from '@/hooks/useBrandManagement';
import { useThemeEffects } from '@/hooks/useThemeEffects';
import { typographyScales } from '@/constants/themeDefaults';
import { generateColorRamp, CurveType } from '@/utils/colorUtils';

// Create the context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const {
    colors, 
    setColors,
    fonts,
    currentFont,
    setCurrentFont,
    fontSizes,
    setFontSizes,
    fontWeights,
    setFontWeights,
    // We're ignoring the stored mode and always setting it to 'light'
    setMode,
    currentTypographyScale,
    setCurrentTypographyScale,
    brands: initialBrands,
    currentBrand: initialCurrentBrand,
    saveTheme,
    resetTheme,
    isLoading,
    userId
  } = useThemeStorage();

  // Always set mode to 'light' regardless of localStorage or system preference
  const mode: ThemeMode = 'light';

  // Update functions for colors
  const updateColor = (colorName: string, step: number, value: string) => {
    setColors(prev => ({
      ...prev,
      [colorName]: {
        ...prev[colorName],
        [step]: value
      }
    }));
  };
  
  const updateColorRamp = (colorName: string, baseColor: string, curveType: CurveType = 'linear') => {
    const newRamp = generateColorRamp(baseColor, curveType);
    setColors(prev => ({
      ...prev,
      [colorName]: newRamp
    }));
  };

  // Use brand management hook
  const brandManagement = useBrandManagement({
    initialBrands,
    initialCurrentBrand,
    updateColors: updateColor,
    updateColorRamp,
    setCurrentFont,
  });

  // Apply theme effects - pass loading state to prevent flicker
  useThemeEffects(colors, currentFont, fontSizes, fontWeights, mode, isLoading);

  // Toggle theme mode
  const toggleMode = () => {
    // This is now a no-op since we always want light mode
  };

  // Font and typography functions
  const updateFont = (font: string) => {
    setCurrentFont(font);
  };

  const updateFontSize = (name: string, value: string) => {
    setFontSizes(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateFontWeight = (name: string, value: number) => {
    setFontWeights(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateTypographyScale = (scale: TypographyScale) => {
    // Find the selected scale definition
    const selectedScale = typographyScales.find(s => s.name === scale);
    
    if (selectedScale) {
      // Update font sizes with the selected scale's sizes
      setFontSizes(selectedScale.sizes);
      setCurrentTypographyScale(scale);
    }
  };

  // Modified to wrap original saveTheme (which now handles Supabase)
  const saveThemeWithBrands = async () => {
    await saveTheme();
  };

  // If still loading, show minimal context (optional)
  if (isLoading) {
    return (
      <ThemeContext.Provider value={{
        colors,
        fonts,
        currentFont,
        fontSizes,
        fontWeights,
        mode,
        currentTypographyScale,
        brands: brandManagement.brands,
        currentBrand: brandManagement.currentBrand,
        toggleMode,
        updateColor,
        updateColorRamp,
        updateFont,
        updateFontSize,
        updateFontWeight,
        updateTypographyScale,
        switchBrand: () => {},
        updateBrandColor: () => {},
        updateBrandFont: () => {},
        addBrand: () => {},
        deleteBrand: () => {},
        saveTheme: () => {},
        resetTheme: () => {},
        isLoading
      }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{
      colors,
      fonts,
      currentFont,
      fontSizes,
      fontWeights,
      mode,
      currentTypographyScale,
      brands: brandManagement.brands,
      currentBrand: brandManagement.currentBrand,
      brandColors: brandManagement.brandColors,
      toggleMode,
      updateColor,
      updateColorRamp,
      updateFont,
      updateFontSize,
      updateFontWeight,
      updateTypographyScale,
      switchBrand: brandManagement.switchBrand,
      updateBrandColor: brandManagement.updateBrandColor,
      updateBrandFont: brandManagement.updateBrandFont,
      updateBrandLogo: brandManagement.updateBrandLogo,
      addBrand: brandManagement.addBrand,
      deleteBrand: brandManagement.deleteBrand,
      storeBrandColorRamp: brandManagement.storeBrandColorRamp,
      resetBrandColorRamp: brandManagement.resetBrandColorRamp,
      saveTheme: saveThemeWithBrands,
      resetTheme,
      isLoading,
      userId
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
