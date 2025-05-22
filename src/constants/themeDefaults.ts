
import { ThemeColors, FontSizes, FontWeights, ThemeMode } from '../types/theme';

// Initial theme values
export const initialColors: ThemeColors = {
  gray: {
    1: "#FFFFFF",
    2: "#F9FAFB",
    3: "#F3F4F6",
    4: "#E5E7EB",
    5: "#D1D5DB",
    6: "#9CA3AF",
    7: "#6B7280",
    8: "#4B5563",
    9: "#374151",
    10: "#1F2937",
    11: "#111827",
    12: "#030712",
  },
  brand: {
    1: "#ECFDF5",
    2: "#D1FAE5",
    3: "#A7F3D0",
    4: "#6EE7B7",
    5: "#34D399",
    6: "#10B981",
    7: "#059669",
    8: "#047857",
    9: "#008077", // Current brand color
    10: "#065F46",
    11: "#064E3B",
    12: "#022C22",
  },
  red: {
    1: "#FEF2F2",
    2: "#FEE2E2",
    3: "#FECACA",
    4: "#FCA5A5",
    5: "#F87171",
    6: "#EF4444",
    7: "#DC2626",
    8: "#B91C1C",
    9: "#991B1B",
    10: "#7F1D1D",
    11: "#671818",
    12: "#450A0A",
  },
  blue: {
    1: "#EFF6FF",
    2: "#DBEAFE",
    3: "#BFDBFE",
    4: "#93C5FD",
    5: "#60A5FA",
    6: "#3B82F6",
    7: "#2563EB",
    8: "#1D4ED8",
    9: "#1E40AF",
    10: "#1E3A8A",
    11: "#172554",
    12: "#0C1331",
  },
  amber: {
    1: "#FFFBEB",
    2: "#FEF3C7",
    3: "#FDE68A",
    4: "#FCD34D",
    5: "#FBBF24",
    6: "#F59E0B",
    7: "#D97706",
    8: "#B45309",
    9: "#92400E",
    10: "#78350F",
    11: "#5E2F12",
    12: "#451A03",
  }
};

export const initialFonts = [
  "Lexend, sans-serif",
  "Inter, sans-serif", 
  "Roboto, sans-serif", 
  "Open Sans, sans-serif",
  "Poppins, sans-serif",
  "Montserrat, sans-serif",
  "Raleway, sans-serif",
  "Playfair Display, serif",
];

export const initialFontSizes: FontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
};

export const initialFontWeights: FontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

export const THEME_STORAGE_KEYS = {
  COLORS: 'themeColors',
  FONT: 'themeFont',
  FONT_SIZES: 'themeFontSizes',
  FONT_WEIGHTS: 'themeFontWeights',
  MODE: 'themeMode'
};
