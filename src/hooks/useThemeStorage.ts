
import { useState, useEffect } from 'react';
import { ThemeColors, FontSizes, FontWeights, ThemeMode } from '../types/theme';
import { initialColors, initialFonts, initialFontSizes, initialFontWeights, THEME_STORAGE_KEYS } from '../constants/themeDefaults';

export const useThemeStorage = () => {
  // Load from localStorage or use initial values
  const [colors, setColors] = useState<ThemeColors>(() => {
    const savedColors = localStorage.getItem(THEME_STORAGE_KEYS.COLORS);
    return savedColors ? JSON.parse(savedColors) : initialColors;
  });
  
  const [fonts] = useState<string[]>(initialFonts);
  
  const [currentFont, setCurrentFont] = useState<string>(() => {
    const savedFont = localStorage.getItem(THEME_STORAGE_KEYS.FONT);
    return savedFont || initialFonts[0];
  });
  
  const [fontSizes, setFontSizes] = useState<FontSizes>(() => {
    const savedFontSizes = localStorage.getItem(THEME_STORAGE_KEYS.FONT_SIZES);
    return savedFontSizes ? JSON.parse(savedFontSizes) : initialFontSizes;
  });
  
  const [fontWeights, setFontWeights] = useState<FontWeights>(() => {
    const savedFontWeights = localStorage.getItem(THEME_STORAGE_KEYS.FONT_WEIGHTS);
    return savedFontWeights ? JSON.parse(savedFontWeights) : initialFontWeights;
  });
  
  // Add theme mode state
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem(THEME_STORAGE_KEYS.MODE);
    return (savedMode as ThemeMode) || 'light';
  });

  // Save theme to localStorage
  const saveTheme = () => {
    localStorage.setItem(THEME_STORAGE_KEYS.COLORS, JSON.stringify(colors));
    localStorage.setItem(THEME_STORAGE_KEYS.FONT, currentFont);
    localStorage.setItem(THEME_STORAGE_KEYS.FONT_SIZES, JSON.stringify(fontSizes));
    localStorage.setItem(THEME_STORAGE_KEYS.FONT_WEIGHTS, JSON.stringify(fontWeights));
    localStorage.setItem(THEME_STORAGE_KEYS.MODE, mode);
  };

  // Reset theme to initial values
  const resetTheme = () => {
    setColors(initialColors);
    setCurrentFont(initialFonts[0]);
    setFontSizes(initialFontSizes);
    setFontWeights(initialFontWeights);
  };

  return {
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
  };
};
