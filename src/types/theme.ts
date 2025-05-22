
// Theme-related type definitions

export interface ColorScale {
  [key: number]: string; // 1-12 scale values
}

export interface ThemeColors {
  [key: string]: ColorScale; // Different color names
}

export interface FontSizes {
  [key: string]: string;
}

export interface FontWeights {
  [key: number | string]: number;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  colors: ThemeColors;
  fonts: string[];
  currentFont: string;
  fontSizes: FontSizes;
  fontWeights: FontWeights;
  mode: ThemeMode;
  toggleMode: () => void;
  updateColor: (colorName: string, step: number, value: string) => void;
  updateColorRamp: (colorName: string, baseColor: string) => void;
  updateFont: (font: string) => void;
  updateFontSize: (name: string, value: string) => void;
  updateFontWeight: (name: string, value: number) => void;
  saveTheme: () => void;
  resetTheme: () => void;
}
