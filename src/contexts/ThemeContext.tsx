
import React, { createContext, useContext, useEffect, FC } from 'react';
import { ThemeContextType, ThemeMode, TypographyScale, Brand } from '../types/theme';
import { generateColorRamp, CurveType } from '../utils/colorUtils';
import { useThemeStorage } from '../hooks/useThemeStorage';
import { typographyScales } from '../constants/themeDefaults';

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
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
    mode,
    setMode,
    currentTypographyScale,
    setCurrentTypographyScale,
    brands,
    setBrands,
    currentBrand,
    setCurrentBrand,
    saveTheme,
    resetTheme
  } = useThemeStorage();

  // Toggle theme mode
  const toggleMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  // Switch brand
  const switchBrand = (brandId: string) => {
    const selectedBrand = brands.find(brand => brand.id === brandId);
    if (selectedBrand) {
      setCurrentBrand(selectedBrand);
      
      // Update primary color in brand color scale
      const newColors = {...colors};
      if (newColors.brand && newColors.brand[9]) {
        newColors.brand[9] = selectedBrand.primaryColor;
      }
      setColors(newColors);
      
      // Update font
      setCurrentFont(selectedBrand.font);
    }
  };

  // Update brand color
  const updateBrandColor = (color: string) => {
    // Update current brand
    const updatedBrand = { ...currentBrand, primaryColor: color };
    setCurrentBrand(updatedBrand);
    
    // Update brands array
    const updatedBrands = brands.map(brand => 
      brand.id === currentBrand.id ? updatedBrand : brand
    );
    setBrands(updatedBrands);
    
    // Update brand color in color scales
    const newColors = {...colors};
    if (newColors.brand && newColors.brand[9]) {
      newColors.brand[9] = color;
    }
    setColors(newColors);
  };

  // Update brand font
  const updateBrandFont = (font: string) => {
    // Update current brand
    const updatedBrand = { ...currentBrand, font };
    setCurrentBrand(updatedBrand);
    
    // Update brands array
    const updatedBrands = brands.map(brand => 
      brand.id === currentBrand.id ? updatedBrand : brand
    );
    setBrands(updatedBrands);
    
    // Update current font
    setCurrentFont(font);
  };

  // Detect user's preferred color scheme on initial load
  useEffect(() => {
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set theme based on user's preference if there's no stored preference
    if (!localStorage.getItem('themeMode')) {
      setMode(userPrefersDark ? 'dark' : 'light');
    }

    // Add listener for changes in color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('themeMode')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    try {
      // Add listener (using the standard method first, then falling back to deprecated method)
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // @ts-ignore - Fallback for older browsers
        mediaQuery.addListener(handleChange);
      }

      // Cleanup function
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange);
        } else {
          // @ts-ignore - Fallback for older browsers
          mediaQuery.removeListener(handleChange);
        }
      };
    } catch (error) {
      console.error('Error setting up media query listener:', error);
      return () => {}; // Empty cleanup function in case of error
    }
  }, [setMode]);

  // Apply theme to document when it changes
  useEffect(() => {
    // Create CSS variables for colors
    Object.entries(colors).forEach(([colorName, scale]) => {
      Object.entries(scale).forEach(([step, value]) => {
        document.documentElement.style.setProperty(
          `--color-${colorName}-${step}`, 
          value
        );
      });
    });
    
    // Apply font family
    document.documentElement.style.setProperty('--font-family', currentFont);
    
    // Apply font sizes
    Object.entries(fontSizes).forEach(([name, size]) => {
      document.documentElement.style.setProperty(`--font-size-${name}`, size);
    });
    
    // Apply font weights
    Object.entries(fontWeights).forEach(([name, weight]) => {
      document.documentElement.style.setProperty(`--font-weight-${name}`, weight.toString());
    });
  }, [colors, currentFont, fontSizes, fontWeights]);
  
  // Apply dark/light mode changes
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme mode preference to localStorage
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Update functions
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

  return (
    <ThemeContext.Provider value={{
      colors,
      fonts,
      currentFont,
      fontSizes,
      fontWeights,
      mode,
      currentTypographyScale,
      brands,
      currentBrand,
      toggleMode,
      updateColor,
      updateColorRamp,
      updateFont,
      updateFontSize,
      updateFontWeight,
      updateTypographyScale,
      switchBrand,
      updateBrandColor,
      updateBrandFont,
      saveTheme,
      resetTheme
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
