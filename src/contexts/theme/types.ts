
import { Brand, ThemeColors, FontSizes, FontWeights, ThemeMode, TypographyScale } from '@/types/theme';
import { CurveType } from '@/utils/colorUtils';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export interface ThemeContextValue {
  colors: ThemeColors;
  fonts: string[];
  currentFont: string;
  fontSizes: FontSizes;
  fontWeights: FontWeights;
  mode: ThemeMode;
  currentTypographyScale: TypographyScale;
  brands: Brand[];
  currentBrand: Brand;
  brandColors?: Record<string, Record<number, string>>;
  toggleMode: () => void;
  updateColor: (colorName: string, step: number, value: string) => void;
  updateColorRamp: (colorName: string, baseColor: string, curveType?: CurveType) => void;
  updateFont: (font: string) => void;
  updateFontSize: (name: string, value: string) => void;
  updateFontWeight: (name: string, value: number) => void;
  updateTypographyScale: (scale: TypographyScale) => void;
  switchBrand: (brandId: string) => void;
  updateBrandColor: (brandId: string, color: string) => void;
  updateBrandFont: (brandId: string, font: string) => void;
  updateBrandLogo?: (brandId: string, logo: string) => void;
  addBrand: (brand: Omit<Brand, 'id'>) => void;
  deleteBrand: (brandId: string) => void;
  storeBrandColorRamp?: (brandId: string, colorRamp: Record<number, string>) => void;
  resetBrandColorRamp?: (brandId: string) => void;
  saveTheme: () => void;
  resetTheme: () => void;
  isLoading?: boolean;
  userId?: string;
  isAdmin?: boolean; // Added to track if current user is admin
}
