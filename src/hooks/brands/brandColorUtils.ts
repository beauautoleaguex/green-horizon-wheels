
import { Brand } from '@/types/theme';
import { initialColors } from '@/constants/themeDefaults';

// Apply MyMoto's predefined color ramp
export const applyMyMotoColors = (
  updateColors: (colorName: string, step: number, value: string) => void
): void => {
  Object.entries(initialColors.brand).forEach(([step, color]) => {
    updateColors('brand', Number(step), color);
  });
};

// Apply stored color ramp for a brand
export const applyStoredBrandColors = (
  brandId: string,
  brandColors: Record<string, Record<number, string>>,
  updateColors: (colorName: string, step: number, value: string) => void
): void => {
  if (brandColors[brandId]) {
    Object.entries(brandColors[brandId]).forEach(([step, color]) => {
      updateColors('brand', Number(step), color);
    });
  }
};

// Generate new color ramp for a brand
export const generateBrandColorRamp = (
  primaryColor: string,
  updateColorRamp: (colorName: string, baseColor: string) => void
): void => {
  updateColorRamp('brand', primaryColor);
};
