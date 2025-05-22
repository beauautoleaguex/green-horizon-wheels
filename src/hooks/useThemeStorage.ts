
import { useState } from 'react';
import { ThemeColors, FontSizes, FontWeights, ThemeMode, TypographyScale, Brand } from '../types/theme';
import { 
  initialColors, 
  initialFonts, 
  initialFontSizes, 
  initialFontWeights, 
  initialTypographyScale,
  initialBrands,
  THEME_STORAGE_KEYS 
} from '../constants/themeDefaults';

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
  
  // Always set mode to 'light', ignoring any saved preference
  const [mode, setMode] = useState<ThemeMode>('light');

  // Add current typography scale state
  const [currentTypographyScale, setCurrentTypographyScale] = useState<TypographyScale>(() => {
    const savedScale = localStorage.getItem(THEME_STORAGE_KEYS.TYPOGRAPHY_SCALE);
    return (savedScale as TypographyScale) || initialTypographyScale;
  });

  // Add brands state
  const [brands, setBrands] = useState<Brand[]>(() => {
    const savedBrands = localStorage.getItem(THEME_STORAGE_KEYS.BRANDS);
    return savedBrands ? JSON.parse(savedBrands) : initialBrands;
  });

  // Add current brand state
  const [currentBrand, setCurrentBrand] = useState<Brand>(() => {
    const savedCurrentBrand = localStorage.getItem(THEME_STORAGE_KEYS.CURRENT_BRAND);
    if (savedCurrentBrand) {
      return JSON.parse(savedCurrentBrand);
    }
    return initialBrands[0];
  });

  // Save theme to localStorage - but don't save mode anymore since we always use light mode
  const saveTheme = () => {
    localStorage.setItem(THEME_STORAGE_KEYS.COLORS, JSON.stringify(colors));
    localStorage.setItem(THEME_STORAGE_KEYS.FONT, currentFont);
    localStorage.setItem(THEME_STORAGE_KEYS.FONT_SIZES, JSON.stringify(fontSizes));
    localStorage.setItem(THEME_STORAGE_KEYS.FONT_WEIGHTS, JSON.stringify(fontWeights));
    // We don't save mode anymore since we always use light
    // localStorage.setItem(THEME_STORAGE_KEYS.MODE, mode);
    localStorage.setItem(THEME_STORAGE_KEYS.TYPOGRAPHY_SCALE, currentTypographyScale);
    localStorage.setItem(THEME_STORAGE_KEYS.BRANDS, JSON.stringify(brands));
    localStorage.setItem(THEME_STORAGE_KEYS.CURRENT_BRAND, JSON.stringify(currentBrand));
  };

  // Reset theme to initial values
  const resetTheme = () => {
    setColors(initialColors);
    setCurrentFont(initialFonts[0]);
    setFontSizes(initialFontSizes);
    setFontWeights(initialFontWeights);
    setCurrentTypographyScale(initialTypographyScale);
    setBrands(initialBrands);
    setCurrentBrand(initialBrands[0]);
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
    currentTypographyScale,
    setCurrentTypographyScale,
    brands,
    setBrands,
    currentBrand,
    setCurrentBrand,
    saveTheme,
    resetTheme
  };
};
