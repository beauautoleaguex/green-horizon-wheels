
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
    userId,
    isAdmin // Get admin status from storage
  } = useThemeStorage();

  // Always set mode to 'light' regardless of localStorage or system preference
  const mode: ThemeMode = 'light';

  // Update functions for colors - only available to admins
  const updateColor = (colorName: string, step: number, value: string) => {
    if (!isAdmin) {
      console.warn('Only admins can update colors');
      return;
    }
    
    setColors(prev => ({
      ...prev,
      [colorName]: {
        ...prev[colorName],
        [step]: value
      }
    }));
  };
  
  const updateColorRamp = (colorName: string, baseColor: string, curveType: CurveType = 'linear') => {
    if (!isAdmin) {
      console.warn('Only admins can update color ramps');
      return;
    }
    
    const newRamp = generateColorRamp(baseColor, curveType);
    setColors(prev => ({
      ...prev,
      [colorName]: newRamp
    }));
  };

  // Use brand management hook with admin status
  const brandManagement = useBrandManagement({
    initialBrands,
    initialCurrentBrand,
    updateColors: updateColor,
    updateColorRamp,
    setCurrentFont,
    isAdmin  // Pass admin status to brand management
  });

  // Apply theme effects - pass loading state to prevent flicker
  useThemeEffects(colors, currentFont, fontSizes, fontWeights, mode, isLoading);

  // Toggle theme mode - disabled as we're always in light mode
  const toggleMode = () => {
    // This is now a no-op since we always want light mode
  };

  // Font and typography functions - only available to admins
  const updateFont = (font: string) => {
    if (!isAdmin) {
      console.warn('Only admins can update fonts');
      return;
    }
    
    setCurrentFont(font);
  };

  const updateFontSize = (name: string, value: string) => {
    if (!isAdmin) {
      console.warn('Only admins can update font sizes');
      return;
    }
    
    setFontSizes(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateFontWeight = (name: string, value: number) => {
    if (!isAdmin) {
      console.warn('Only admins can update font weights');
      return;
    }
    
    setFontWeights(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateTypographyScale = (scale: TypographyScale) => {
    if (!isAdmin) {
      console.warn('Only admins can update typography scales');
      return;
    }
    
    // Find the selected scale definition
    const selectedScale = typographyScales.find(s => s.name === scale);
    
    if (selectedScale) {
      // Update font sizes with the selected scale's sizes
      setFontSizes(selectedScale.sizes);
      setCurrentTypographyScale(scale);
    }
  };

  // Modified to wrap original saveTheme with admin check
  const saveThemeWithBrands = async () => {
    await saveTheme();
  };

  // If still loading, show minimal context
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
      switchBrand: brandManagement.switchBrand, // Everyone can switch brands
      updateBrandColor: brandManagement.updateBrandColor, // Only admins can change brand colors
      updateBrandFont: brandManagement.updateBrandFont, // Only admins can change brand fonts
      updateBrandLogo: brandManagement.updateBrandLogo, // Only admins can change brand logos
      addBrand: brandManagement.addBrand, // Only admins can add brands
      deleteBrand: brandManagement.deleteBrand, // Only admins can delete brands
      storeBrandColorRamp: brandManagement.storeBrandColorRamp, // Only admins can store brand color ramps
      resetBrandColorRamp: brandManagement.resetBrandColorRamp, // Only admins can reset brand color ramps
      saveTheme: saveThemeWithBrands, // Admins save all, users save only brand preference
      resetTheme, // Only affects admins
      isLoading,
      userId,
      isAdmin: brandManagement.isAdmin || isAdmin // Expose admin status to consumers
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
