
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

  // Detect user's preferred color scheme on initial load
  useEffect(() => {
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check if there's a stored preference
    const hasStoredPreference = !!localStorage.getItem('themeMode');
    
    // Return object for component usage
    return () => {}; // Empty cleanup function to satisfy TypeScript
  }, []);

  // Return the detected preference data
  const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const hasStoredPreference = !!localStorage.getItem('themeMode');
  
  return { userPrefersDark, hasStoredPreference };
};
