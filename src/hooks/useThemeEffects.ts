
import { useEffect } from 'react';
import { ThemeColors, ThemeMode } from '@/types/theme';

export const useThemeEffects = (
  colors: ThemeColors,
  currentFont: string,
  fontSizes: Record<string, string>,
  fontWeights: Record<string | number, number>,
  mode: ThemeMode
) => {
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
  
  // Apply light mode only - we've removed dark mode
  useEffect(() => {
    // Always ensure light mode is applied
    document.documentElement.classList.remove('dark');
    
    // Don't save mode preference to localStorage anymore
    // localStorage.setItem('themeMode', mode);
  }, [mode]);

  // We've removed the effect that detected user's preferred color scheme

  // Return an empty object as we no longer need to detect preferences
  return {};
};
