
import React, { createContext, useContext, useEffect } from 'react';
import { ThemeContextType, ThemeMode } from '../types/theme';
import { generateColorRamp } from '../utils/colorUtils';
import { useThemeStorage } from '../hooks/useThemeStorage';

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    saveTheme,
    resetTheme
  } = useThemeStorage();

  // Toggle theme mode
  const toggleMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

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
  
  const updateColorRamp = (colorName: string, baseColor: string) => {
    const newRamp = generateColorRamp(baseColor);
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

  return (
    <ThemeContext.Provider value={{
      colors,
      fonts,
      currentFont,
      fontSizes,
      fontWeights,
      mode,
      toggleMode,
      updateColor,
      updateColorRamp,
      updateFont,
      updateFontSize,
      updateFontWeight,
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
