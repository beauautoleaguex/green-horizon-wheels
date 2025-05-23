
import { useEffect } from 'react';
import { ThemeColors, ThemeMode } from '@/types/theme';

export const useThemeEffects = (
  colors: ThemeColors,
  currentFont: string,
  fontSizes: Record<string, string>,
  fontWeights: Record<string | number, number>,
  mode: ThemeMode,
  isLoading?: boolean
) => {
  // Skip applying theme if data is still loading
  useEffect(() => {
    if (isLoading) {
      return; // Don't apply theme while loading
    }

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
  }, [colors, currentFont, fontSizes, fontWeights, isLoading]);
  
  // Apply light mode only - we've removed dark mode
  useEffect(() => {
    if (isLoading) {
      return; // Don't apply theme mode while loading
    }
    
    // Always ensure light mode is applied
    document.documentElement.classList.remove('dark');
  }, [mode, isLoading]);

  // Return an empty object as we no longer need to detect preferences
  return {};
};
