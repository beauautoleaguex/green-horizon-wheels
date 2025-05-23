
import { Brand } from '@/types/theme';
import { CurveType } from '@/utils/colorUtils';

export interface UseBrandManagementProps {
  initialBrands: Brand[];
  initialCurrentBrand: Brand;
  updateColors: (colorName: string, step: number, value: string) => void;
  updateColorRamp: (colorName: string, baseColor: string, curveType?: CurveType) => void;
  setCurrentFont: (font: string) => void;
  isAdmin?: boolean; // Added isAdmin prop
}

export interface UseBrandManagementReturn {
  brands: Brand[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
  currentBrand: Brand;
  setCurrentBrand: React.Dispatch<React.SetStateAction<Brand>>;
  brandColors?: Record<string, Record<number, string>>;
  switchBrand: (brandId: string) => void;
  addBrand: (brand: Omit<Brand, 'id'>) => void;
  deleteBrand: (brandId: string) => void;
  updateBrandColor: (brandId: string, color: string) => void;
  updateBrandFont: (brandId: string, font: string) => void;
  updateBrandLogo?: (brandId: string, logo: string) => void;
  storeBrandColorRamp?: (brandId: string, colorRamp: Record<number, string>) => void;
  resetBrandColorRamp?: (brandId: string) => void;
  isAdmin: boolean; // Added to return if user is an admin
}
