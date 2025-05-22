
// Theme-related type definitions
import { CurveType } from '../utils/colorUtils';

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

export type TypographyScale = 'classic' | 'modern' | 'compact' | 'comfortable' | 'custom';

export interface TypographyScaleDefinition {
  name: TypographyScale;
  description: string;
  sizes: FontSizes;
}

export interface Brand {
  id: string;
  name: string;
  primaryColor: string;
  font: string;
}

export interface ThemeContextType {
  colors: ThemeColors;
  fonts: string[];
  currentFont: string;
  fontSizes: FontSizes;
  fontWeights: FontWeights;
  mode: ThemeMode;
  currentTypographyScale: TypographyScale;
  brands: Brand[];
  currentBrand: Brand;
  toggleMode: () => void;
  updateColor: (colorName: string, step: number, value: string) => void;
  updateColorRamp: (colorName: string, baseColor: string, curveType?: CurveType) => void;
  updateFont: (font: string) => void;
  updateFontSize: (name: string, value: string) => void;
  updateFontWeight: (name: string, value: number) => void;
  updateTypographyScale: (scale: TypographyScale) => void;
  switchBrand: (brandId: string) => void;
  updateBrandColor: (color: string) => void;
  updateBrandFont: (font: string) => void;
  addBrand: (brand: Omit<Brand, 'id'>) => void;
  deleteBrand: (brandId: string) => void;
  saveTheme: () => void;
  resetTheme: () => void;
}
